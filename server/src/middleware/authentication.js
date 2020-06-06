const { checkToken } = require('../lib/helpers')
const Login = require('../models/Login')

/**
 * Make sure that user sending the request is authenticated.
 *
 * 1. First check that there is a token in the headers. 	
 * 2. Then verify that token is a valid JSON Web Token and that it's payload is verified.	
 * 3. Then check that there is a login record with that token.	
 */

const ensureAuthenticated = async (req, res, next) => {
	try {
		let token = req.headers['authorization'] || req.headers['x-access-token'] || '' // Express headers are auto converted to lowercase
		if (token.startsWith('Bearer')) {
			// Get only token from the string
			token = token.split(' ')[1]
		}
	
		if (!token) {
			return res.status(401).json({
				name: 'UnauthorizedError',
				message: 'Access denied' // Token not present
			})
		}
		
		const { validToken, decoded } = await checkToken(token)
		if (!validToken) {
			return res.status(401).json({
				name: 'UnauthorizedError',
				message: 'Access denied' // Token malformed/not valid
			})
		}
	
		// Check that there is a login record with this token
		const loginRecord = await Login.findOne({ token: validToken })
		if (!loginRecord) {
			return res.status(401).json({
				name: 'UnauthorizedError',
				message: 'Access denied' // No login record
			})
		}

		req.user = decoded || null
		req.user.id = loginRecord.user

		console.log(decoded)
		return next()
	} catch (err) {
		return next(err)
	}
}

module.exports = {
	ensureAuthenticated: ensureAuthenticated
}