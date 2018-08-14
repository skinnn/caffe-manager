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

      const newUser = new User({
        username: username,
        password: password
      })
      await User.createUser(newUser, function(err, user) {
        if (err) {
          console.log(err)
          res.status(400).send({
            error: 'This username is already in use.'
          })
        } else {
          console.log(user)
          res.send(user.toJSON())
        }
      })
    } catch (err) {
      res.status(400).send({
        error: 'An error occurred.'
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
          res.send(admin.toJSON())
        }
      })
    } catch (err) {
      res.status(400).send({
        error: 'An error occurred.'
      })
    }
  },

  // User Login
  loginUser(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.send({
          message: 'Log in authentication failed.'
        })
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err)
        }
        return res.send({
          message: `Logged in: ${user.username}`
        })
      })
    })(req, res, next)
  },

  // Admin Login
  loginAdmin(req, res, next) {
    passport.authenticate('local', function(err, admin, info) {
      if (err) {
        return next(err)
      }
      if (!admin) {
        return res.send({
          message: 'Log in authentication failed.'
        })
      }
      req.logIn(admin, function(err) {
        if (err) {
          return next(err)
        }
        return res.send({
          message: `Logged in: ${admin.username}`
        })
      })
    })(req, res, next)
  }
}
