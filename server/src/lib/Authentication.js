const Controller = require('../lib/Controller')
const { checkToken, haveCommonElements } = require('../lib/helpers')
const Login = require('../api/v1/auth/auth.model')

/**
 * REST API Authentication
 */
class Authentication extends Controller {
	/**
	 * Make sure that user sending the request is authenticated.
	 * 
	 * 1. First get schema & CRUD operation user is trying to access
	 * 2. If endpoint doesnt require authentication then proceed
	 * 3. If endpoint requires authentication then:
	 * 	- Check if there is a token present in any of these headers: Authorization, Cookie, X-access-token
	 * 	- Check that token is a valid JWT
	 * 	- Check if a login record for this token exists
	 * 	- Check if user is authorized to access the requested CRUD operation on this endpoint
	 */
	static async ensureAuthenticated(req, res, next) {
		try {
			req.operation = Controller.getCRUDFromRequest(req)
			// Check if authorization is required
			if (req.schema.access[req.operation].roles.includes('anon')) {
				// Proceed since anonymous can access this resource & operation
				return next()
			} else {
				const unauthorizedError = Controller.makeError('UnauthorizedError', 'Access denied')
				// Get token
				// TODO: Also look for the token in query params
				const token = Authentication.getTokenFromRequest(req)
				if (!token) throw unauthorizedError
				
				// TODO: Save token and decoded user in cache, check cache first
				const { validToken, decoded } = await checkToken(token)
				if (!validToken || !decoded) throw unauthorizedError
			
				// TODO: Save login in cache, check cache first
				// Check that there is a login record with this token
				const loginRecord = await Login.findOne({ token: validToken })
				if (!loginRecord) throw unauthorizedError

				req.user = decoded || null

				// If it's root user continue, otherwise check user permissions
				if (req.user.roles.includes('root')) return next()
				else {
					const authorized = Authentication.checkPermissions(req)
					if (authorized) return next()
					else {
						let err = new Error('Invalid permission')
						err.name = 'ForbiddenError'
						throw err
					}
				}
			}
		} catch (err) {
			return next(err)
		}
	}

	// Check privileges/permissions of user sending the request
	static checkPermissions(req) {
		var authorized = false
		if (!req.user) return authorized = false
		if (Array.isArray(req.user.roles) && req.user.roles.length <= 0) req.user.roles = ['anon']

		const schema = req.schema
		// console.log(`Requested operation ${req.operation.toUpperCase()} on protected endpoint: ${req.resource} `)
		
		const hasRole = haveCommonElements(schema.access[req.operation].roles, req.user.roles)
		if (hasRole) authorized = true
		else authorized = false

		return authorized
	}

	static getTokenFromRequest(req) {
		let token
		// Prioritize the token from the query params
		if (req.queryParsed.token) {
			token = req.queryParsed.token
		} else {
			token = req.headers['authorization'] || req.headers['x-access-token'] || null // Express headers are auto converted to lowercase
			// If testing, check the cookie
			if (req.headers['user-agent'].includes('node-superagent')) {
				token = token || req.cookies.token || null
			}
		}		

		if (token && token.startsWith('Bearer')) {
			token = token.split(' ')[1]
		}
		return token
	}
}

module.exports = Authentication