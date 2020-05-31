const { checkToken } = require('../lib/helpers')
const Login = require('../models/Login')
const User = require('../models/User')

/**
 * Make sure that user sending the request is authenticated.
 *
 * First check that there is a token in the headers
 * Then check that token is a valid JSON Web Token
 * Then check that there is a login record with that token.
 */

const ensureAuthenticated = async(req, res, next) => {
	try {
		let token = req.headers['authorization'] || req.headers['x-access-token'] || '' // Express headers are auto converted to lowercase
		if (token.startsWith('Bearer')) {
			// Get only token from the string
			token = token.split(' ')[1]
		}
	
		if (!token) {
			return res.status(401).json({
				success: false,
				message: 'Access denied. Token is not provided.'
			})
		}
		
		const { validToken, decoded } = await checkToken(token)
	
		// Check that there is a login record with this token
		const loginRecord = await Login.findOne({ token: validToken })

		if (!loginRecord) {
			return res.status(401).json({
				success: false,
				message: 'Access denied. No login record found for this user.'
			})
		}

		// const user = await User.getUserById(loginRecord.user)
		// Set user in the request object
		req.user = decoded || null
		
		return next()
	} catch (err) {
		if (err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
			return res.status(401).json({
				success: false,
				message: 'Access denied. Token is not valid.'
			})
		}
		console.error(err)
	}
}

module.exports = {
	ensureAuthenticated: ensureAuthenticated
}