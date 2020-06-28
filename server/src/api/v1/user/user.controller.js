const Controller = require('../../../lib/Controller')
const AttachmentController = require('./attachment/user.attachment.controller')

const User = require('./user.model')
// const UserSchema = require('./user.schema')
const UserJSONSchema = require('./user.schema.json')

class UserController extends Controller {

	// Create user
	static async createUser(req, res, next) {
		try {
			// Validate to JSON schema
			const error = Controller.validateToSchema(UserJSONSchema, req.body)
			if (error) {
				return res.status(400).json({
					message: error
				})
			}

			const userExist = await User.getUserByUsername(req.body.username)
			if (userExist) {
				return res.status(400).json({
					success: false,
					message: `User: ${req.body.username} already exist`
				})
			}

			// Hash password
			const hash = await User.hashPassword(req.body.password)

			let newUser = new User(req.body)
			newUser.password = hash
			newUser.created_by = req.user.id

			const createdUser = await User.createUser(newUser)

			res.locals = {
				status: 201,
				json: { user: createdUser }
			}
			
			return next()
		} catch (err) {
			return next(err)
		}
	}

	// Delete User by id
	static async deleteUserById(req, res, next) {
		try {
			const query = {_id: req.params.id }

			const userToDelete = await User.findOne(query)
			if (!userToDelete) {
				return res.status(404).json({
					message: 'User not found'
				})
			}

			if (!req.user.roles.includes('admin')) {
				Controller.validateOwnership(req, userToDelete)
			}

			const deletedUser = await User.deleteOne(query)
			if (deletedUser) {
				AttachmentController.deleteAttachments(userToDelete.files)
			}

			res.locals = {
				status: 200,
				json: {
					message: 'User deleted'
				}
			}

			return next()
		} catch (err) {
			return next(err)
		}
	}

	// Get User login List - [usernames and names]
	static async getUsersByRole(req, res, next) {
		try {
			// If not root or admin return only users with 'user' role
			let role = 'user'
			if (req.user) {
				if (req.user.roles.includes('root') || req.user.roles.includes('admin')) {
					role = req.queryParsed.match.role ? req.queryParsed.match.role : ''
				}
			}

			const query = {
				roles: { $all: [role] }
			}
			const users = await User.find(query).select('-_id username name')

			return res.status(200).json({
				users: users
			})
		} catch (err) {
			return next(err)
		}
	}
	
	// Get all Users
	static async getAllUsers(req, res, next) {
		try {
			const match = req.queryParsed.match
			// Dont return the root user
			match.roles = {
				$in: ['user', 'admin']
			}
			
			const users = await User
				.find(match)
				.populate(req.queryParsed.include)
				.select(req.queryParsed.fields)
				.limit(req.queryParsed.limit)
				.sort(req.queryParsed.sort)
			
			res.locals = {
				status: 200,
				json: { users: users }
			}
			return next()
		} catch (err) {
			return next(err)
		}
	}
	
	// Get User by id
	static async getUserById(req, res, next) {
		try {
			const user = await User.findById(req.params.id)
				.populate(req.queryParsed.include)

			if (!req.user.roles.includes('admin')) {
				Controller.validateOwnership(req, user)
			}

			res.locals = {
				status: 200,
				json: { user: user }
			}

			return next()
		} catch (err) {
			return next(err)
		}
	}
	
	// Update User by id
	static async updateUserById(req, res, next) {
		try {
			const query = { _id: req.params.id }
			const options = { new: true }
			var data = req.body

			// Validate body
			const modifiedSchema = UserJSONSchema
			modifiedSchema.required = []
			const error = Controller.validateToSchema(modifiedSchema, req.body)
			if (error) throw new Error(error)

			const userToUpdate = await User.findOne(query)

			// Validate ownership if its user
			if (!req.user.roles.includes('admin')) {
				Controller.validateOwnership(req, userToUpdate)
			}

			// Check if password field is passed
			if (req.body.password) {
				// Hash password
				const hash = await User.hashPassword(req.body.password)
				data.password = hash
			}

			data.updated = new Date(Date.now()).toString()
			data.updated_by = req.user.id
			const	updatedUser = await User
				.findOneAndUpdate(query, data, options)
				.populate(req.queryParsed.include)

			res.locals = {
				status: 200,
				json: { user: updatedUser }
			}
			return next()
		} catch (err) {
			return next(err)
		}
	}

}

module.exports = UserController