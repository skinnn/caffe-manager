const fs = require('fs')
const path = require('path')

const Controller = require('../../../lib/Controller')
const FileController = require('../file/file.controller')

const User = require('./user.model')
const File = require('../file/file.model')
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
			let query = { _id: req.params.id }

			const userToDelete = await User.findOne(query)
			if (!userToDelete) {
				return res.status(404).json({
					message: 'User not found'
				})
			}

			Controller.validateOwnership(req, userToDelete)

			const deletedUser = await User.deleteOne(query)

			// Remove user files if any (both attachments and user file meta)
			if (userToDelete.files.length > 0) {
				userToDelete.files.forEach((file) => {
					// TODO: Get file meta
					// TODO: Remove file
					// fs.unlink(absoluteFilePath)
					// TODO: Write a test which adds a user and attachment and then deletes it
				})
			}

			res.locals = {
				status: 200,
				json: {
					message: 'User deleted successfully',
					user: deletedUser
				}
			}

			return next()
		} catch (err) {
			return next(err)
		}
	}

	// Get User login List - just usernames and names
	static async getUsersByRole(req, res, next) {
		try {
			const role = req.query.role || null
			// Dont allow querying for the root user
			if (role.includes('root')) role = null
			let query = {
				roles: { $all: [role] }
			}
			const users = await User.find(query).select('-_id username name')

			req.authorized = true
			res.locals = {
				status: 200,
				json: { users: users }
			}
			return next()
		
		} catch (err) {
			return next(err)
		}
	}
	
	// Get all Users
	static async getAllUsers(req, res, next) {
		try {
			const users = await User.find({ roles: 'user' })
			return res.status(200).json({
				users: users
			})
		} catch (err) {
			return next(err)
		}
	}
	
	// Get User by id
	static async getUserById(req, res, next) {
		try {
			const user = await User.getUserById(req.params.id)

			Controller.validateOwnership(req, user)

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
		// TODO: Not working
		try {
			let query = {_id: req.body.id}
			let options = { new: true }
			
			// TODO: Remove parsing if not needed
			const jsonData = JSON.parse(JSON.stringify(req.body))
			var dataToReplace = {}

			for (let [key, value] of Object.entries(jsonData)) {
				// console.log(`${key}: ${value}`)
				if (value !== undefined && value !== null) {
					dataToReplace[key] = value
				}
			}

			const user = await User.findOne(query)

			Controller.validateOwnership(req, user)

			const updatedUser = await User.findOneAndUpdate(query, dataToReplace, options)

			res.locals = {
				status: 200,
				json: { user: updatedUser }
			}
			
			return next()
		} catch (err) {
			return next(err)
		}
	}

	// Create attachment for a user
	static async createAttachment(req, res, next) {
		try {
			if (!req.query.identifier) {
				return res.status(400).json({
					message: 'File identifier is required.'
				})
			}

			const file = req.file
			const identifier = req.query.identifier
			const userId = req.params.id
			// Save uploaded file's metadata in the db
			const fileMeta = await FileController.saveFileMeta(file, identifier, userId)

			// Add new file id to user's files array
			const user = await User.findById(userId)
			user.files.push(fileMeta.id)
			await user.save()

			// const qUser = await User.findById(userId).populate('files')

			res.locals = {
				status: 201
			}
			return next()			
		} catch (err) {
			return next(err)
		}
	}

	// TODO: Get user attachment
	// GET /user/:id/attachment

	// Create attachment for a user
	static async getAttachment(req, res, next) {
		try {
			if (!req.queryParsed.match.identifier) {
				let err = new Error('Query string parameter: "identifier" for the attachment is not specified.')
				err.name = 'BadRequestError'
				throw err
			}
			const id = req.params.id || null
			// const identifier = req.query.identifier || null
			const match = req.queryParsed.match
			match.user_id = id
			const file = await File.findOne(match)

			Controller.validateOwnership(req, file)

			res.locals = {
				status: 200,
				file: file
			}
			return next()
		} catch (err) {
			return next(err)
		}
	}

	static async getAttachmentById(req, res, next) {
		const id = req.params.id || ''

		const file = await File.findById(id)
		if (!file) {
			return res.sendStatus(404)
		}

		Controller.validateOwnership(req, file)

		res.locals = {
			status: 200,
			file: file
		}
		return next()
	}
}

module.exports = UserController