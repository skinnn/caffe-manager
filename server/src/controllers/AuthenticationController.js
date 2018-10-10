const passport = require('passport')
const User = require('../models/User')
const Admin = require('../models/Admin')

module.exports = {

  // User Register
  async registerUser(req, res) {
    try {
      // console.log('FILE', req.file)
      // console.log('BODY', req.body)
      const username = req.body.userUsername
      const name = req.body.userName
      const password = req.body.userPassword
      const password2 = req.body.userPassword2
      let image = ''
      // If image is added create image path
      if (req.file !== undefined && req.file !== '') {
        image = req.file.path
      }
      const createdBy = {
        id: req.body.createdBy.id,
        name: req.body.createdBy.name,
        username: req.body.createdBy.username
      }
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
        username: username,
        name: name,
        password: password,
        userMenu: userMenu,
        createdBy: createdBy,
        image: image
      })
      await User.createUser(newUser, function(err, user) {
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

  // Admin Register
  async registerAdmin(req, res) {
    try {
      // console.log('FILE', req.file)
      // console.log('BODY', req.body)
      const username = req.body.adminUsername
      const name = req.body.adminName
      const password = req.body.adminPassword
      const password2 = req.body.adminPassword2
      const createdBy = {
        id: req.body.createdBy.id,
        name: req.body.createdBy.name,
        username: req.body.createdBy.username
      }
      let image = ''

      // If image is added create image path
      if (req.file !== undefined && req.file !== '') {
        image = req.file.path
      }

      const newAdmin = new Admin({
        username: username,
        name: name,
        password: password,
        createdBy: createdBy,
        image: image
      })
      await Admin.createAdmin(newAdmin, function(err, admin) {
        if (err) {
          console.log(err)
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

  // User Login
  async loginUser(req, res, next) {
    try {
      await passport.authenticate('user', function(err, user, info) {
        if (err) {
          return next(err)
        }
        if (!user) {
          return res.status(403).send({
            error: 'Login authentication has failed.'
          })
        }
        req.logIn(user, function(err) {
          if (err) {
            return next(err)
          }
          return res.send({
            user: user
          })
        })
      })(req, res, next)
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to log in.'
      })
    }
  },

  // Admin Login
  async loginAdmin(req, res, next) {
    try {
      await passport.authenticate('admin', function(err, admin, info) {
        if (err) {
          return next(err)
        }
        if (!admin) {
          return res.status(403).send({
            error: 'Log in authentication failed.'
          })
        }
        req.logIn(admin, function(err) {
          if (err) {
            return next(err)
          }
          return res.send({
            admin: admin,
            success: `Logged in: ${admin.username}`
          })
        })
      })(req, res, next)
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to log in.'
      })
    }
  },

  // User Logout
  async logoutUser(req, res) {
    try {
      await req.logout()

      return res.send({
        user: false,
        loggedOutMessage: 'Logged out.'
      })
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to logout.'
      })
    }
  },

  // Admin Logout
  async logoutAdmin(req, res) {
    try {
      await req.logout()

      return res.send({
        admin: false,
        loggedOutMessage: 'Logged out.'
      })
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to logout.'
      })
    }
  }

} /* Module exports */
