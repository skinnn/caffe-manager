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
				// Remove user files if any (both actual files and user file meta)
				if (userToDelete.files.length > 0) {
					const promises = userToDelete.files.map(async (fileId) => {
						// const file = await FileController.getFileById(fileId)
						const deletedFile = await FileController.deleteFileById(fileId)
						
						if (deletedFile) {
							const filePath = path.join(Controller.api.uploads.imagesDirectory, deletedFile.name)

							// Check if file exists
							fs.access(filePath, fs.F_OK, (err) => {
								if (err) return
							})
							const deletedAttachment = await fs.unlinkSync(filePath)

							return deletedFile
						}
					})

					const deletedFiles = await Promise.all(promises)
					console.log('DEL FILES: ', deletedFiles)
				}
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

	// Get User login List - just usernames and names
	static async getUsersByRole(req, res, next) {
		try {
			// If not root or admin return only users with 'user' role
			let role = 'user'
			if (req.user) {
				if (req.user.roles.includes('root') || req.user.roles.includes('admin')) {
					role = req.queryParsed.match.role ? req.queryParsed.match.role : ''
				}
				req.user.roles.includes('root') && req.user.roles.includes('admin')
			}

			let query = {
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
			const fields = req.queryParsed.fields
			const include = req.queryParsed.include
			const limit = req.queryParsed.limit
			const sort = req.queryParsed.sort
			
			const users = await User
				.find(match)
				.populate(include)
				.select(fields)
				.limit(limit)
				.sort(sort)
			
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

			const	updatedUser = await User.findOneAndUpdate(query, data, options)

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

			console.log(file)
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