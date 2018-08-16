const passport = require('passport')
const User = require('../models/User')
const Admin = require('../models/Admin')

module.exports = {

  // User Register
  async registerUser(req, res) {
    try {
      const username = req.body.username
      const password = req.body.password
      const password2 = req.body.password2
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
        }
      ]
      console.log(userMenu)

      const newUser = new User({
        username: username,
        password: password,
        userMenu: userMenu
      })
      await User.createUser(newUser, function(err, user) {
        if (err) {
          console.log(err)
          res.status(400).send({
            error: 'This username is already in use.'
          })
        } else {
          console.log(user)
          res.send({
            user: user,
            success: `You have successfully registered. ${user.username}`
          })
        }
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to register the user.'
      })
    }
  },

  // Admin Register
  async registerAdmin(req, res) {
    try {
      const username = req.body.username
      const password = req.body.password
      const password2 = req.body.password2

      const newAdmin = new Admin({
        username: username,
        password: password
      })
      await Admin.createAdmin(newAdmin, function(err, admin) {
        if (err) {
          console.log(err)
          res.status(400).send({
            error: 'This username is already in use.'
          })
        } else {
          console.log(admin)
          res.send({
            admin: admin
          })
        }
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to register the admin.'
      })
    }
  },

  // User Login
  async loginUser(req, res, next) {
    try {
      passport.authenticate('local', function(err, user, info) {
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
      res.status(500).send({
        error: 'An error has occurred trying to log in.'
      })
    }
  },

  // Admin Login
  async loginAdmin(req, res, next) {
    try {
      passport.authenticate('local', function(err, admin, info) {
        if (err) {
          return next(err)
        }
        if (!admin) {
          return res.send({
            error: 'Log in authentication failed.'
          })
        }
        req.logIn(admin, function(err) {
          if (err) {
            return next(err)
          }
          return res.send({
            success: `Logged in: ${admin.username}`
          })
        })
      })(req, res, next)
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to log in.'
      })
    }
  },

  // User Logout
  async logoutUser(req, res) {
    try {
      req.logout()
      res.send({
        success: 'You are logged out.'
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to logout.'
      })
    }
  }
}
