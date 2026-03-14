module.exports = {
	HTTP_STATUS: {
		BAD_REQUEST: 400,
		UNAUTHORIZED: 404
	},
	AUTH: {
		BEARER_PREFIX: 'Bearer ',
		LOGIN_FAIL_MAX: 3,
		LOCK_TIME_MS: 60 * 60 * 1000,
		TOKEN_EXPIRES_IN: '1h'
	},
	JWT: {
		ALGORITHM: 'RS256',
		ALGORITHMS: ['RS256'],
		PRIVATE_KEY_ENV: 'JWT_PRIVATE_KEY',
		PUBLIC_KEY_ENV: 'JWT_PUBLIC_KEY',
		PRIVATE_KEY_FILE: 'private.key',
		PUBLIC_KEY_FILE: 'public.key'
	},
	MESSAGES: {
		LOGIN_REQUIRED: 'ban chua dang nhap',
		INVALID_LOGIN: 'thong tin dang nhap khong dung',
		USER_BANNED: 'user dang bi ban',
		OLD_PASSWORD_INVALID: 'oldpassword khong dung',
		NEW_PASSWORD_SAME_AS_OLD: 'newpassword khong duoc trung voi oldpassword',
		CHANGE_PASSWORD_SUCCESS: 'doi mat khau thanh cong'
	}
};
