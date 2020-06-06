const bcrypt = require('bcryptjs')
const fs = require('fs')
const config = require('../config/config')
const User = require('../models/User')
const File = require('../models/File')

module.exports = {

	// Create root Admin if it doesn't exist
	createRootAdmin() {
		return new Promise((resolve, reject) => {
			// Create or Update
			let query = { root: true }
			User.find(query, (err, admin) => {
				if (err) reject(err)
				// If Root Admin exists
				if (admin.length > 0) {
					console.log('Root user already exists')
					resolve(true)
				} else if (!admin.root) {
					// If Root User doesn't exist create one
					const defaultRoot = {
						root: true,
						roles: ['admin'],
						username: config.rootUser.username,
						password: config.rootUser.password
					}
					const admin = new User(defaultRoot)
					// Hash the password
					bcrypt.genSalt(10, (err, salt) => {
						if (err) reject(err)
						bcrypt.hash(admin.password, salt, (err, hash) => {
							if (err) reject(err)
							console.log('Root user created.')
							admin.password = hash
							// Save Root User in the database
							admin.save()
							resolve(admin)
						})
					})
				} else {
					console.log('An error has occurred while creating the root user.')
				}
			})
		})
	},

	// Create user
	async createUser(req, res, next) {
		try {
			const userExist = await User.getUserByUsername(req.body.username)
			if (userExist) {
				return res.status(400).json({
					success: false,
					message: `User: ${req.body.username} already exist`
				})
			}
			// TODO: Fix User privileges
			// Create user menu
			// const userMenu = [
			//   {
			//     'warehouse': req.body.userMenu.warehouse,
			//     'title': 'Warehouse',
			//     'icon': 'storage',
			//     'route': '/user/warehouse'
			//   },
			//   {
			//     'tables': req.body.userMenu.tables,
			//     'title': 'Tables',
			//     'icon': 'view_carousel',
			//     'route': '/user/tables'
			//   },
			//   {
			//     'home': req.body.userMenu.home,
			//     'title': 'Home',
			//     'icon': 'home',
			//     'route': '/user/home'
			//   }
			// ]

			// Hash password
			const hashedPassword = await User.hashPassword(req.body.password)

			// const imageURL = req.file !== undefined && req.file !== '' ? req.file.path : ''
			
			const newUser = new User({
				roles: req.body.roles,
				username: req.body.username,
				password: hashedPassword,
				name: req.body.name,
				email: req.body.email,
				phone: req.body.phone,
				address: req.body.address,
				note: req.body.note,
				createdBy: req.body.createdBy
				// userMenu: userMenu,
			})

			const savedUser = await User.createUser(newUser)
			return res.status(201).json({
				success: true,
				user: savedUser
			})
		} catch (err) {
			console.error(err)
			return res.status(500).send({
				success: false,
				error: err
			})
		}
	},

	// Delete User by id
	async deleteUserById(req, res) {
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
	},
	
	// Get Admins
	async getAllAdmins(req, res) {
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
	},

	// Get User login List - just usernames and names
	async getLoginList(req, res) {
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
	},
	
	// Get all Users
	async getAllUsers(req, res) {
		try {
			const users = await User.find({ roles: 'user' })
			return res.status(200).json({
				users: users
			})
		} catch (err) {
			return next(err)
		}
	},
	
	// Get User by id
	async getUserById(req, res) {
		try {
			const query = {_id: req.params.id || null}
			const user = await User.getUserById(query)
			return res.status(200).json({
				user: user
			})
		} catch (err) {
			return next(err)
		}
	},
	
	// Update User by id
	async updateUserById(req, res) {
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
	},

	// Create attachment for a user
	async createAttachment(req, res, next) {
		try {
			if (!req.query.identifier) {
				return res.status(400).json({
					message: 'File identifier is required.'
				})
			}

			// TODO: Uplaod file in the file controller, call it from here
			const file = req.file
			const ext = file.originalname.split('.').pop()
			
			const fileMeta = {
				name: file.filename, // File name that is generated after file is uploaded
				identifier: req.query.identifier,
				ext: ext,
				mime: file.mimetype,
				size: file.size,
				__owner: req.user.id
			}
			const newFile = new File(fileMeta)

			// Save uploaded file's metadata to db
			const savedFile = await File.createFile(newFile)

			// Add new file data to user's files
			const options = { new: true }
			let fileToAdd = {
				id: savedFile.id,
				identifier: savedFile.identifier
			}
			const fields = {
				$push: {
					files: fileToAdd
				}
			}
			const updatedUser = await User.findByIdAndUpdate(req.user.id, fields, options)

			return res.status(201).json({
				success: true,
				file: savedFile,
				updatedUser: updatedUser
			})
		} catch (err) {
			return next(err)
		}
	}
	
} /* Module exports */