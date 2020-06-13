const fs = require('fs')
const path = require('path')

const Controller = require('../../../lib/Controller')
const FileController = require('../file/file.controller')

const User = require('./user.model')
const File = require('../file/file.model')
// const UserSchema = require('./user.schema')
const UserJSONSchema = require('./user.jsonschema.json')

class UserController extends Controller {

	// Create user
	static async createUser(req, res, next) {
		try {
			console.log('BODY: ', req.body)
			// Validate to Joi schema
			// const { error, value } = await UserSchema.create(req.body)
			// if (error) return next(error)
			// Validate to JSON schema

			// const valid = Controller.ajv.validate(UserJSONSchema, req.body)
			// const errorMessage = Controller.formatSchemaErrors(Controller.ajv.errors)
			// if (!valid) {
			// 	return res.status(400).json({
			// 		message: errorMessage
			// 	})
			// }

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

			// const imageURL = req.file !== undefined && req.file !== '' ? req.file.path : ''
			
			let newUser = new User(req.body)
			newUser.password = hash
			newUser.created_by = req.user.id

			const savedUser = await User.createUser(newUser)

			return res.status(201).json({
				success: true,
				user: savedUser
			})
		} catch (err) {
			return next(err)
		}
	}

	// Delete User by id
	static async deleteUserById(req, res, next) {
		try {
			let query = { _id: req.params.id }

			// Get image path
			let img = req.body.imgPath
			console.log('BODY: ', req.body)
			// Create full image path so it can be deleted with fs.unlink
			let fullImgPath = ''
			if (img !== '') {
				let dirPath = process.cwd()
				fullImgPath = dirPath + '/' + img
			}
			
			// res.status(200).json({
			// 	success: true,
			// 	message: 'Got it.'
			// })

			User.deleteOne(query, (err) => {
				if (err) throw err

				if (fullImgPath && fullImgPath !== '') {
					fs.unlink(fullImgPath, (err) => {
						if (err) throw err
						return res.status(200).json({
							success: true,
							message: 'User deleted successfully.'
						})
					})
				}
			})
		} catch (err) {
			return next(err)
		}
	}
	
	// Get Admins
	static async getAllAdmins(req, res, next) {
		try {
			await User.find({ roles: 'admin' }, (err, admins) => {
				if (err) throw err
				return res.status(200).json({
					admins: admins
				})
			})
		} catch (err) {
			return next(err)
		}
	}

	// Get User login List - just usernames and names
	static async getLoginList(req, res, next) {
		const role = req.query.role || null
		try {
			let query = {
				roles: { $all: [role] },
				root: false // Don't return the root user
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
			return res.status(200).json({
				user: user
			})
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
			
			const jsonData = JSON.parse(JSON.stringify(req.body))
			var dataToReplace = {}

			for (let [key, value] of Object.entries(jsonData)) {
				// console.log(`${key}: ${value}`)
				if (value !== undefined && value !== null) {
					dataToReplace[key] = value
				}
			}

			// If image is added add image path
			if (req.file !== undefined && req.file !== '') {
				// TODO: This overrides the whole files Array, needs a fix
				dataToReplace.files = [req.file.path]
			}

			console.log('final: ', dataToReplace)

			User.findOneAndUpdate(query, dataToReplace, options, (err, user) => {
				if (err) {
					throw err
				}
				console.log('usr', user)
				return res.status(200).json({
					user: user
				})
			})
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
			const savedFile = await FileController.saveFileMeta(file, identifier, userId)

			// Add new file id to user's files array
			const user = await User.findById(userId)
			user.files.push(savedFile.id)
			await user.save()

			// const qUser = await User.findById(userId).populate('files')
			
			return res.status(201).json({
				file: savedFile
			})
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
			console.log('req.queryParsed: ', req.queryParsed)
			// TODO: Add to get user
			// const user = await User.findById(id).populate('files')
			// console.log('USER WITH FILES: ', user)
			const file = await File.findOne(match)
			const fileName = file ? file.name : ''
			// const fullPath = path.join(Controller.api.uploads.imagesDirectory, fileName)
			const fullPath = path.join(Controller.api.uploads.imagesDirectory, fileName)

			return res.status(200).sendFile(fullPath)
		} catch (err) {
			return next(err)
		}
	}

	static async getAttachmentById(req, res, next) {
		const id = req.params.id || ''

		const file = await File.findById(id)
		console.log('FILE: ', file)
		const fileName = file ? file.name : ''
		const fullPath = path.join(Controller.api.uploads.imagesDirectory, fileName)
		return res.status(200).sendFile(fullPath)
	}
}

module.exports = UserController