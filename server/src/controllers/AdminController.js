const passport = require('passport')
const Admin = require('../models/Admin')
const User = require('../models/User')

module.exports = {

  // Get Admins
  async getAllAdmins(req, res) {
    try {
      await Admin.find({}, function(err, admins) {
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

  // Get Admin by id
  async getAdminById(req, res) {
    try {
      let query = req.params.adminId
      await Admin.getAdminById(query, function(err, admin) {
        if (err) {
          console.log(err)
        } else {
          res.send({
            admin: admin
          })
        }
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to get the admin data.'
      })
    }
  },

  // Update Admin by id
  async saveAdmin(req, res) {
    try {
      let query = {_id: req.params.adminId}

      await Admin.update(query, req.body, function(err, admin) {
        if (err) {
          console.log(err)
        } else {
          res.send({
            admin: admin
          })
        }
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to update the admin data.'
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
      let query = req.params.userId
      await User.getUserById(query, function(err, user) {
        if (err) {
          console.log(err)
        } else {
          res.send({
            user: user
          })
        }
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to get the admin data.'
      })
    }
  },

  // Update User by id
  async saveUser(req, res) {
    try {
      let query = {_id: req.params.userId}

      await User.update(query, req.body, function(err, user) {
        if (err) {
          console.log(err)
        } else {
          res.send({
            user: user
          })
        }
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to update the user data.'
      })
    }
  }

} /* Module exports */
