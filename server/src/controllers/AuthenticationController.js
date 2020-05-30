const User = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

const Login = require('../models/Login')

// Sign user
function jwtSignUser(user) {
	// const ONE_HOUR = 60 * 60 * 24
	// TODO: Sign only username, roles fields
  return jwt.sign(user.toJSON(), config.authentication.jwtSecret, {
    // expiresIn: ONE_HOUR
  })
}

module.exports = {

	async login(req, res) {
		try {
			const user = await User.getUserByUsername(req.body.username)

			if (!user) {
				res.setHeader('Content-Type', 'application/json')
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

			const token = jwtSignUser(user)
			const login = new Login({
				user: user.id,
				username: user.username,
				password: user.password,
				token: token
			})

			login.save((err) => {
				if (err) throw err

				res.setHeader('Content-Type', 'application/json')
				return res.json({
					user,
					token
				})
			})

		} catch (err) {
			console.error(err)
		}
	},

	async logout(req, res) {
		try {
			const authHeader = req.headers['authorization'] || req.headers['x-access-token'] || ''
			const token = authHeader.split(' ')[1] || ''
			const isDeleted = await Login.deleteMany({ token: token})
			// const loginAfter = await Login.getLoginByToken(token)

			if (!isDeleted) {
				return res.status(500).json({
					message: 'An error occurred while trying to delete the login record.'
				})
			}

			return res.status(200).json({
				message: 'Logged out successfully.'
			})

		} catch (err) {
			console.error(err)
			return res.status(500).json({
				message: 'An error occurred while logging out.'
			})
		}
	},

  // User Register
  // async registerUser(req, res) {
  //   try {
  //     const username = req.body.userUsername
  //     const password = req.body.userPassword
  //     // const password2 = req.body.userPassword2
  //     const name = req.body.userName
  //     const telephone1 = req.body.userTelephone1
  //     const telephone2 = req.body.userTelephone2
  //     const address = req.body.userAddress
  //     const note = req.body.userNote

  //     // const isTable = req.body.isTables

  //     let image = ''
  //     // If image is added create image path
  //     if (req.file !== undefined && req.file !== '') {
  //       image = req.file.path
  //     }
  //     const createdBy = {
  //       id: req.body.createdBy.id,
  //       name: req.body.createdBy.name,
  //       username: req.body.createdBy.username
  //     }

  //     // TODO: Fix User privileges
  //     // Create user menu
  //     const userMenu = [
  //       {
  //         'warehouse': req.body.userMenu.warehouse,
  //         'title': 'Warehouse',
  //         'icon': 'storage',
  //         'route': '/user/warehouse'
  //       },
  //       {
  //         'tables': req.body.userMenu.tables,
  //         'title': 'Tables',
  //         'icon': 'view_carousel',
  //         'route': '/user/tables'
  //       },
  //       {
  //         'home': req.body.userMenu.home,
  //         'title': 'Home',
  //         'icon': 'home',
  //         'route': '/user/home'
  //       }
  //     ]

  //     const newUser = new User({
  //       username: username,
  //       password: password,
  //       name: name,
  //       telephone1: telephone1,
  //       telephone2: telephone2,
  //       address: address,
  //       note: note,
  //       userMenu: userMenu,
  //       createdBy: createdBy,
  //       image: image
	// 		})

  //     User.createUser(newUser, function(err, user) {
  //       if (err) {
  //         console.log(err)
  //         return res.status(400).send({
  //           error: 'This username is already in use.'
  //         })
  //       } else {
  //         return res.send({
  //           user: user,
  //           success: `User: ${user.username} is successfully registered.`
  //         })
  //       }
  //     })
  //   } catch (err) {
  //     return res.status(500).send({
  //       error: 'An error has occurred trying to register the user.'
  //     })
  //   }
  // },

  // Admin Register
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
