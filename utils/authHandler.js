let userController = require("../controllers/users")
let { verifyToken } = require('./jwtHandler')
let { HTTP_STATUS, AUTH, MESSAGES } = require('./constants')
module.exports = {
    checkLogin: async function (req, res, next) {
        try {
            let token = req.headers.authorization;
            if (!token || !token.startsWith(AUTH.BEARER_PREFIX)) {
                res.status(HTTP_STATUS.UNAUTHORIZED).send(MESSAGES.LOGIN_REQUIRED)
                return;
            }
            token = token.split(" ")[1];
            let result = verifyToken(token);
            if (result.exp * 1000 > Date.now()) {
                let user = await userController.FindUserById(result.id);
                if (user) {
                    req.user = user
                    next()
                } else {
                    res.status(HTTP_STATUS.UNAUTHORIZED).send(MESSAGES.LOGIN_REQUIRED)
                }
            } else {
                res.status(HTTP_STATUS.UNAUTHORIZED).send(MESSAGES.LOGIN_REQUIRED)
            }
        } catch (error) {
            res.status(HTTP_STATUS.UNAUTHORIZED).send(MESSAGES.LOGIN_REQUIRED)
        }
    }
}