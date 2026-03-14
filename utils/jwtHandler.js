let fs = require('fs');
let path = require('path');
let jwt = require('jsonwebtoken');
let { AUTH, JWT } = require('./constants')

function normalizePem(pem) {
    if (!pem) {
        return null;
    }
    return pem.replace(/\\n/g, '\n');
}

function loadPrivateKey() {
    let fromEnv = normalizePem(process.env[JWT.PRIVATE_KEY_ENV]);
    if (fromEnv) {
        return fromEnv;
    }
    return fs.readFileSync(path.join(__dirname, '..', 'keys', JWT.PRIVATE_KEY_FILE), 'utf8');
}

function loadPublicKey() {
    let fromEnv = normalizePem(process.env[JWT.PUBLIC_KEY_ENV]);
    if (fromEnv) {
        return fromEnv;
    }
    return fs.readFileSync(path.join(__dirname, '..', 'keys', JWT.PUBLIC_KEY_FILE), 'utf8');
}

let PRIVATE_KEY = loadPrivateKey();
let PUBLIC_KEY = loadPublicKey();

module.exports = {
    signToken: function (payload, options) {
        return jwt.sign(payload, PRIVATE_KEY, {
            algorithm: JWT.ALGORITHM,
            expiresIn: AUTH.TOKEN_EXPIRES_IN,
            ...options
        });
    },
    verifyToken: function (token) {
        return jwt.verify(token, PUBLIC_KEY, {
            algorithms: JWT.ALGORITHMS
        });
    }
};