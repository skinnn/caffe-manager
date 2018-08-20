const passport = require('passport')
const User = require('../models/User')
const Admin = require('../models/Admin')
const Storage = require('../models/Storage')

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

  // Save Admin by id
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
        error: 'An error has occurred trying to update the admin.'
      })
    }
  }

} /* Module exports */
