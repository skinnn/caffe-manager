const Controller = require('../lib/Controller')
const { checkToken, haveCommonElements } = require('../lib/helpers')
const Login = require('../api/v1/auth/auth.model')

/**
 * REST API Authentication
 */
class Authentication extends Controller {

	// TODO: Finish
	/**
	 * Make sure that user sending the request is authenticated.
	 * 
	 * 1. First get endpoint & CRUD operation user is trying to access
	 * 2. If endpoint doesnt require authentication then proceed
	 * 3. If endpoint requires authentication then:
	 * 	Check if there is a token present in any of these headers: Authorization, Cookie, X-access-token
	 * 	Check that it is a valid JWT
	 * 	Check if a login record for this token exists
	 * 	Check if user is authorized to access the requested CRUD operation on this endpoint
	 */
	static async ensureAuthenticated(req, res, next) {
		try {
			const schema = Controller.api.schemas[req.resource]
			// const operation = Controller.getCRUDFromMethod(req.method)
			req.operation = Controller.getCRUDFromMethod(req.method)
			// Check if authorization is required
			if (schema.access[req.operation].roles.includes('anon')) {
				// Proceed since anonymous can access this resource & operation
				return next()
			} else {
				let unauthorizedError = new Error('Access denied'); unauthorizedError.name = 'UnauthorizedError';
				
				let token = req.headers['authorization'] || req.headers['x-access-token'] || req.cookies.token || null // Express headers are auto converted to lowercase
				if (token && token.startsWith('Bearer')) {
					// Get only token from the string
					token = token.split(' ')[1]
				}	else throw unauthorizedError

				
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
					const authorized = Authentication.checkPermissions(req, schema)
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
	static checkPermissions(req, schema) {
		var authorized = false
		if (!req.user) return authorized = false
		if (Array.isArray(req.user.roles) && req.user.roles.length <= 0) req.user.roles = ['anon']

		console.log(`Requested operation ${req.operation.toUpperCase()} on protected endpoint: ${req.resource} `)
		
		const hasRole = haveCommonElements(schema.access[req.operation].roles, req.user.roles)
		if (hasRole) authorized = true
		else authorized = false

		return authorized
	}
}

module.exports = Authentication