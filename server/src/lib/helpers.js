const jwt = require('jsonwebtoken')
const config = require('../config/config.js')

const secret = config.authentication.jwtSecret

const checkToken = (token) => {
	return new Promise((resolve, reject) => {
		if (token) {
			jwt.verify(token, secret, (err, decoded) => {
				if (err) {
					reject(err)
				}

				resolve({ validToken: token, decoded })
			})
		}

		throw new Error('Token is not provided.')
	})
}

// TODO: Check credentials helper (is user/admin/anon authorized to access the resource)

module.exports = {
	checkToken: checkToken
}