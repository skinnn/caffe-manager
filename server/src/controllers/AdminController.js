const passport = require('passport')
const Admin = require('../models/Admin')
const User = require('../models/User')
const dateHandler = require('./getDate')
const fs = require('fs')

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

      let admin = {}
      admin.name = req.body.name
      admin.username = req.body.username
      // TODO: Also edit admin password
      // admin.password = req.body.password
      admin.updated_date = dateHandler.getCurrentTime()

      // Check if the name is typed and create article in the db
      if (admin.name !== '' && admin.username !== '') {
        await Admin.findOneAndUpdate(query, req.body, { upsert: true, new: true }, function(err, admin) {
          if (err) {
            console.log(err)
          } else {
            res.send({
              saved: true,
              admin: admin,
              success: `Admin: ${admin.name} has been successfully saved.`
            })
          }
        })
      }
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

      await User.findOneAndUpdate(query, req.body, function(err, user) {
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
  },

  // Delete Admin
  async deleteAdmin(req, res) {
    try {
      let query = {_id: req.params.adminId}

      // Get image path
      let img = req.body.imgPath
      // Create full image path so it can be deleted with fs.unlink
      let fullImgPath = ''
      if (img !== '') {
        let dirPath = process.cwd()
        fullImgPath = dirPath + '/' + img
      }

      await Admin.remove(query, function(err) {
        if (err) {
          res.status(500).send({
            error: 'A database error has occurred trying to delete the admin.'
          })
        }
        if (fullImgPath !== '') {
          fs.unlink(fullImgPath, function(err) {
            if (err) {
              res.status(500).send({
                error: 'An error has occurred trying to delete the image.'
              })
            }
          })
        }
        res.send({
          deleted: true,
          success: 'Admin deleted.'
        })
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to delete the admin.'
      })
    }
  }

} /* Module exports */
