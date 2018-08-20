const passport = require('passport')
const User = require('../models/User')
const Admin = require('../models/Admin')

module.exports = {

  // User Register
  async registerUser(req, res) {
    try {
      const username = req.body.username
      const name = req.body.name
      const password = req.body.password
      const password2 = req.body.password2
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
      console.log(userMenu)

      const newUser = new User({
        username: username,
        password: password,
        name: name,
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
      const name = req.body.name

      const newAdmin = new Admin({
        username: username,
        password: password,
        name: name
      })
      await Admin.createAdmin(newAdmin, function(err, admin) {
        if (err) {
          console.log(err)
          res.status(400).send({
            error: 'This username is already in use.'
          })
        } else {
          res.send({
            admin: admin,
            success: `You have successfully registered. ${admin.username}`
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
      res.status(500).send({
        error: 'An error has occurred trying to log in.'
      })
    }
  },

  // Admin Login
  async loginAdmin(req, res, next) {
    try {
      await passport.authenticate('admin', function(err, user, info) {
        if (err) {
          return next(err)
        }
        if (!user) {
          return res.status(403).send({
            error: 'Log in authentication failed.'
          })
        }
        req.logIn(user, function(err) {
          if (err) {
            return next(err)
          }
          return res.send({
            admin: user,
            success: `Logged in: ${user.username}`
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
      await req.logout()

      res.send({
        user: false,
        loggedOutMessage: 'Logged out.'
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to logout.'
      })
    }
  },

  // Admin Logout
  async logoutAdmin(req, res) {
    try {
      await req.logout()

      res.send({
        admin: false,
        loggedOutMessage: 'Logged out.'
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to logout.'
      })
    }
  }

} /* Module exports */
