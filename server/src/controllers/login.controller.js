const User = require('../models/User')
const helpers = require('../lib/helpers')

const Login = require('../models/Login')

module.exports = {

	async login(req, res, next) {
		res.setHeader('Content-Type', 'application/json')
		try {
			// console.log('SESSION: ', req.session)
			const user = await User.getUserByUsername(req.body.username)

			if (!user) {
				return res.status(401).json({
					error: {
						message: 'Incorrect username or password.'
					}
				})
			}

			const candidatePassword = req.body.password
			// const isMatch = await Admin.compareAdminPassword(candidatePassword, user.password)
			const isMatch = await User.compareUserPassword(candidatePassword, user.password)

			if (!isMatch) {
				return res.status(401).json({
					error: {
						message: 'Incorrect username or password..'
					}
				})
			}

			const token = helpers.jwtSignUser(user)
			const login = new Login({
				user: user.id,
				username: user.username,
				password: user.password,
				token: token
			})

			login.save((err) => {
				if (err) throw err

				return res.json({
					user,
					token
				})
			})
		} catch (err) {
			return next(err)
		}
	},

	async logout(req, res, next) {
		try {
			// TODO: Extract token in Authentication class, use that class method here
			const authHeader = req.headers['authorization'] || req.headers['x-access-token'] || ''
			const token = authHeader.split(' ')[1] || ''
			const isDeleted = await Login.deleteMany({ token: token })

			if (!isDeleted) {
				return res.status(500).json({
					message: 'An error occurred while trying to delete the login record.'
				})
			}

			return res.status(200).json({
				message: 'Logged out successfully.'
			})
		} catch (err) {
			return next(err)
		}
	}

} /* Module exports */