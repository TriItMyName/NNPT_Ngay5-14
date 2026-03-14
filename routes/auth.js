let express = require('express')
let router = express.Router()
let userController = require('../controllers/users')
let { RegisterValidator, ChangePasswordValidator, validatedResult } = require('../utils/validator')
let bcrypt = require('bcrypt')
let { signToken } = require('../utils/jwtHandler')
const { checkLogin } = require('../utils/authHandler')
let { HTTP_STATUS, AUTH, MESSAGES } = require('../utils/constants')

router.post('/register', RegisterValidator, validatedResult, async function (req, res, next) {
    let { username, password, email } = req.body;
    let newUser = await userController.CreateAnUser(
        username, password, email, '69b2763ce64fe93ca6985b56'
    )
    res.send(newUser)
})
router.post('/login', async function (req, res, next) {
    let { username, password } = req.body;
    let user = await userController.FindUserByUsername(username);
    if (!user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).send({
            message: MESSAGES.INVALID_LOGIN
        })
        return;
    }
    if (!user.lockTime || user.lockTime < Date.now()) {
        if (bcrypt.compareSync(password, user.password)) {
            user.loginCount = 0;
            await user.save();
            let token = signToken({
                id: user._id,
            })
            res.send(token)
        } else {
            user.loginCount++;
            if (user.loginCount == AUTH.LOGIN_FAIL_MAX) {
                user.loginCount = 0;
                user.lockTime = new Date(Date.now() + AUTH.LOCK_TIME_MS)
            }
            await user.save();
            res.status(HTTP_STATUS.UNAUTHORIZED).send({
                message: MESSAGES.INVALID_LOGIN
            })
        }
    } else {
        res.status(HTTP_STATUS.UNAUTHORIZED).send({
            message: MESSAGES.USER_BANNED
        })
    }

})
router.get('/me',checkLogin, function (req,res,next) {
    res.send(req.user)
})

router.post('/change-password', checkLogin, ChangePasswordValidator, validatedResult, async function (req, res, next) {
    let { oldpassword, newpassword } = req.body;

    if (!bcrypt.compareSync(oldpassword, req.user.password)) {
        res.status(HTTP_STATUS.BAD_REQUEST).send({
            message: MESSAGES.OLD_PASSWORD_INVALID
        });
        return;
    }

    if (bcrypt.compareSync(newpassword, req.user.password)) {
        res.status(HTTP_STATUS.BAD_REQUEST).send({
            message: MESSAGES.NEW_PASSWORD_SAME_AS_OLD
        });
        return;
    }

    req.user.password = newpassword;
    await req.user.save();

    res.send({
        message: MESSAGES.CHANGE_PASSWORD_SUCCESS
    });
})

module.exports = router;