const User = require('../models/User')
const config = require('../config/config')
const bcrypt = require('bcryptjs')

module.exports = {

	// Create root Admin if it doesn't exist
  async createRootAdmin() {
    try {
      // Create or Update
      let query = { root: true }
      User.find(query, (err, admin) => {
        if (err) {
					throw err
        }
				// If Root Admin exists
				if (admin.length > 0) {
					return console.log('Root user already exists')

				} else if (!admin.root) {
					// If Root User doesn't exist create one
					const admin = new User({
						root: true,
						username: 'admin',
						password: '123123',
						roles: ['admin']
					})
					// Hash the password
					bcrypt.genSalt(10, (err, salt) => {
						if (err) {
							throw err
						}
						bcrypt.hash(admin.password, salt, (err, hash) => {
							if (err) {
								throw err
							}
							console.log('Root user created.')
							admin.password = hash
							// Save Root User in the database
							admin.save()
						})
					})
				} else {
					console.log('An error has occurred while creating the root user.')
				}
      })
    } catch (err) {
      console.log(err)
      return res.status(500).send({
        error: 'An error has occurred trying to fetch/create the root user.'
      })
    }
	},

  // Create user
  async createUser(req, res) {
		// TODO: Check is username not already registered
    try {
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

			const imageURL = req.file !== undefined && req.file !== '' ? req.file.path : ''
			
      const newUser = new User({
				// roles: ['user'],
				roles: req.body.roles,
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        note: req.body.note,
        createdBy: req.body.createdBy,
        files: [imageURL]
				// userMenu: userMenu,
			})

      User.createUser(newUser, (err, user) => {
        if (err) {
          console.log(err)
          return res.status(400).send({
            error: 'This username is already in use.'
          })
        } else {
          return res.send({
            user: user,
            success: `User: ${user.username} is successfully registered.`
          })
        }
      })
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to register the user.'
      })
    }
	},
	
	// Create Admin
  async createAdmin(req, res) {
		// TODO: Rewrite createAdmin/createUser in one function - createUser
		// TODO: Check is username not already registered
    try {
      const image = req.file !== undefined && req.file !== '' ? req.file.path : ''

      // Create new admin object
      const newAdmin = new User({
        roles: ['admin'],
        root: false,
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        telephone1: req.body.telephone1,
        telephone2: req.body.telephone2,
        address: req.body.address,
        note: req.body.note,
        image: image,
        createdBy: req.body.createdBy
			})

      User.createAdmin(newAdmin, (err, admin) => {
        if (err) {
          console.error(err)
          return res.status(400).send({
            error: 'This username is already in use.'
          })
        } else {
          return res.send({
            admin: admin,
            success: `You have successfully registered. ${admin.username}`
          })
        }
      })
    } catch (err) {
      console.log(err)
      return res.status(500).send({
        error: 'An error has occurred trying to register the admin. Please try again.'
      })
    }
	},
	
	// Get Admins
  async getAllAdmins(req, res) {
    try {
      await User.find({ roles: 'admin' }, (err, admins) => {
        if (err) {
          console.log(err)
        } else {
          res.send({
            admins: admins
          })
        }
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to get the list of admins.'
      })
    }
	},

	// Get User login List - just usernames and names
	async getLoginList(req, res) {
		const role = req.params.role || null
    try {
			let query = {
				roles: { $all : [role] }
			}
			const users = await User.find(query).select('-_id username name')

			return res.status(200).json({
				users: users
			})
    } catch (err) {
      console.log(err)
      res.status(500).json({
        error: `An error has occurred trying to get the login list for ${role}.`
      })
    }
	},
	
	// Get all Users
  async getAllUsers(req, res) {
    try {
      await User.find({}, function(err, users) {
        if (err) {
          console.log(err)
        } else {
          res.send({
            users: users
          })
        }
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occurred trying to get the list of staff members.'
      })
    }
	},
	
	// Get User by id
  async getUserById(req, res) {
    try {
      let query = req.params.id || null
      User.getUserById(query, (err, user) => {
        if (err) {
					throw err
				}
				return res.status(200).json({
					user: user
				})
      })
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to get the user.'
      })
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
			console.error(err)
      return res.status(500).json({
        error: 'An error has occurred trying to update the user data.'
      })
    }
  },

  // // Admin Register
  // async registerAdmin(req, res) {
  //   try {
  //     // console.log('FILE', req.file)
  //     // console.log('BODY', req.body)
  //     const username = req.body.adminUsername
  //     const password = req.body.adminPassword
  //     // const password2 = req.body.adminPassword2
  //     const name = req.body.adminName
  //     const telephone1 = req.body.telephone1
  //     const telephone2 = req.body.telephone2
  //     const address = req.body.address
  //     const note = req.body.userName
  //     const createdBy = req.body.createdBy

  //     let image = ''
  //     // If image is added create image path
  //     if (req.file !== undefined && req.file !== '') {
  //       image = req.file.path
  //     }

  //     // Create new admin object
  //     const newAdmin = new Admin({
  //       roles: ['admin'],
  //       root: false,
  //       username: username,
  //       password: password,
  //       name: name,
  //       telephone1: telephone1,
  //       telephone2: telephone2,
  //       address: address,
  //       note: note,
  //       image: image,
  //       createdBy: createdBy
	// 		})

  //     Admin.createAdmin(newAdmin, function(err, admin) {
  //       if (err) {
  //         console.error(err)
  //         return res.status(400).send({
  //           error: 'This username is already in use.'
  //         })
  //       } else {
  //         return res.send({
  //           admin: admin,
  //           success: `You have successfully registered. ${admin.username}`
  //         })
  //       }
  //     })
  //   } catch (err) {
  //     console.log(err)
  //     return res.status(500).send({
  //       error: 'An error has occurred trying to register the admin. Please try again.'
  //     })
  //   }
  // }
	
} /* Module exports */
