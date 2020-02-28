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
      // const isTable = req.body.isTables
      const image = req.file !== undefined && req.file !== '' ? req.file.path : ''

      // TODO: Fix User privileges
      // Create user menu
      const userMenu = [
        {
          'warehouse': req.body.userMenu.warehouse,
          'title': 'Warehouse',
          'icon': 'storage',
          'route': '/user/warehouse'
        },
        {
          'tables': req.body.userMenu.tables,
          'title': 'Tables',
          'icon': 'view_carousel',
          'route': '/user/tables'
        },
        {
          'home': req.body.userMenu.home,
          'title': 'Home',
          'icon': 'home',
          'route': '/user/home'
        }
			]
			
      const newUser = new User({
				roles: ['user'],
				// roles: req.body.roles,
        username: req.body.userUsername,
        password: req.body.userPassword,
        name: req.body.userName,
        telephone1: req.body.userTelephone1,
        telephone2: req.body.userTelephone2,
        address: req.body.userAddress,
        note: req.body.userNote,
        createdBy: req.body.createdBy.id,
        image: image,
				userMenu: userMenu,
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

	// Get Admin login List - just usernames and names
	async getAdminLoginList(req, res) {
		try {
			let query = {
				roles: { $all : ['admin'] },
				root: false
			}
			const admins = await User.find(query).select('-_id username name')
			{ $all : ["sushi", "bananas"] }
			return res.status(200).json({
				admins: admins,
			})
		
		} catch (err) {
			console.error(err)
			return res.status(500).send({
				error: 'An error has occurred trying to get the admin list.'
			})
		}
	},
	
	// // Get Admin login List - just usernames and names
  // async getAdminLoginList(req, res) {
  //   try {
  //     // Find all admins except the root user/admin
  //     let query = { root: false }
  //     User.find(query)
  //       .select('-_id username name')
  //       .exec()
  //       .then(docs => {
  //         if (docs.length > 0) {
  //           return res.json({
  //             admins: docs
  //           })
  //         } else {
  //           return res.send({
	// 						admins: docs,
  //             noAdmins: 'No admins.'
  //           })
  //         }
  //       })
  //       .catch(err => {
  //         console.error(err)
  //         return res.status(500).send({
  //           error: 'An error has occurred trying to get the admin list.'
  //         })
  //       })
  //   } catch (err) {
  //     console.error(err)
  //     return res.status(500).send({
  //       error: 'An error has occurred trying to get the list of admins.'
  //     })
  //   }
	// },
	
	 // Get User login List - just usernames and names
	 async getUserLoginList(req, res) {
    try {
			let query = {
				roles: { $all : ['user'] }
			}
			const users = await User.find(query).select('-_id username name')

			return res.status(200).json({
				users: users
			})
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occurred trying to get the list of staff members.'
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
