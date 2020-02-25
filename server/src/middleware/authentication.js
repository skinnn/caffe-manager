const { checkToken } = require('../lib/helpers')
const Login = require('../models/Login')

/**
 * Make sure that user sending the request is authenticated.
 * 
 * First check that there is a token in the headers
 * Then check that token is a valid JSON Web Token
 * Then check that there is a login record with that token.
 */

const ensureAuthenticated = async (req, res, next) => {
	try {
		let token = req.headers['x-access-token'] || req.headers['authorization'] || '' // Express headers are auto converted to lowercase
		if (token.startsWith('Bearer')) {
			// Remove Bearer from string
			token = token.split(' ')[1]
		}
	
		if(!token) {
			return res.status(401).json({
				success: false,
				message: 'Token is not provided.'
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

		req.decoded = decoded
		next()
	
	} catch (err) {
		if (err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
			console.error(err)
			return res.status(401).json({
				success: false,
				message: 'Token is not valid.'
			})
		}
	}
}

module.exports = {
	ensureAuthenticated: ensureAuthenticated
}