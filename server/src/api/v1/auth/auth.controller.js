const helpers = require('../../../lib/helpers')

const Controller = require('../../../lib/Controller')
const User = require('../user/user.model')
const Login = require('./auth.model')
const AuthJSONSchema = require('./auth.schema.json')

class AuthController extends Controller {

	static async login(req, res, next) {
		res.setHeader('Content-Type', 'application/json')
		try {
			// Validate to JSON schema
			const error = Controller.validateToSchema(AuthJSONSchema, req.body)
			if (error) {
				return res.status(400).json({
					message: error
				})
			}

			const user = await User.findOne({ username: req.body.username })

			if (!user) {
				return res.status(401).json({
					message: 'Incorrect username or password'
				})
			}

			const candidatePassword = req.body.password
			const isMatch = await User.compareUserPassword(candidatePassword, user.password)

			if (!isMatch) {
				return res.status(401).json({
					message: 'Incorrect username or password'
				})
			}

			const token = helpers.jwtSignUser(user)
			const login = new Login({
				user_id: user.id,
				username: user.username,
				password: user.password,
				token: token
			})

			await login.save()

			req.authorized = true
			res.locals = {
				status: 200,
				json: {
					user: user,
					token: token
				}
			}
			return next()
		} catch (err) {
			return next(err)
		}
	}

	static async logout(req, res, next) {
		try {
			// TODO: Extract token in Authentication class, use that class method here
			const authHeader = req.headers['authorization'] || req.headers['x-access-token'] || ''
			const token = authHeader.split(' ')[1] || ''
			const query = { token: token }

			const loginRecord = await Login.findOne(query)

			Controller.validateOwnership(req, loginRecord)

			res.locals.status = 200
			res.locals.json = {
				message: 'Logged out successfully'
			}
			return next()
		} catch (err) {
			return next(err)
		}
	}

}

module.exports = AuthController