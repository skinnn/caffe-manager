// Models
const Admin = require('../models/Admin')
const User = require('../models/User')
const passport = require('passport')
// Modules
const bcrypt = require('bcryptjs')
const fs = require('fs')
const dateHandler = require('./getDate')

module.exports = {

  // Create root Admin if it doesn't exist
  async createRootAdmin(req, res) {
    try {
      // Create or Update
      let query = { root: true, username: 'admin' }
      // let update = { root_admin: true }
      await Admin.find(query, (err, admin) => {
        if (err) {
          return res.status(500).send({
            error: 'An DB error has occurred trying to find the root.'
          })
        } else {
          // If Root Admin exists
          if (admin && admin.length > 0) {
            return res.send({
              rootExist: true,
              message: 'Root admin already exist.'
            })
          // If Root User doesn't exist
          } else if (admin.root !== true && admin.username !== 'admin') {
            // If no Root User is found create one
            const admin = new Admin({
              root: true,
              username: 'admin',
              password: '123123',
              userRoles: ['admin']
            })
            // Create default crypted password
            bcrypt.genSalt(10, (err, salt) => {
              if (err) {
                return console.log(err)
              }
              bcrypt.hash(admin.password, salt, (err, hash) => {
                if (err) {
                  return console.log(err)
                }
                admin.password = hash
                // Save Root User in the database
                admin.save()
              })
            })
            // Root User created message
            return res.send({
              rootCreated: true,
              message: 'Root user created.'
            })
          } else {
            return res.status(500).send({
              error: 'An error has occured.'
            })
          }
        }
      })
    } catch (err) {
      console.log(err)
      return res.status(500).send({
        error: 'An error has occurred trying to fetch/create the root user.'
      })
    }
	},
	
	// Create Admin
  async createAdmin(req, res) {
    try {
      const username = req.body.adminUsername
      const password = req.body.adminPassword
      // const password2 = req.body.adminPassword2
      const name = req.body.adminName
      const telephone1 = req.body.telephone1
      const telephone2 = req.body.telephone2
      const address = req.body.address
      const note = req.body.userName
      const createdBy = req.body.createdBy

      let image = ''
      // If image is added create image path
      if (req.file !== undefined && req.file !== '') {
        image = req.file.path
      }

      // Create new admin object
      const newAdmin = new Admin({
        userRoles: ['admin'],
        root: false,
        username: username,
        password: password,
        name: name,
        telephone1: telephone1,
        telephone2: telephone2,
        address: address,
        note: note,
        image: image,
        createdBy: createdBy
			})

      Admin.createAdmin(newAdmin, (err, admin) => {
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
      let options = { upsert: true, new: true }

      let admin = {}
      admin.name = req.body.name
      admin.username = req.body.username
      // TODO: Also edit admin password
      // admin.password = req.body.password
      admin.updated_date = dateHandler.getCurrentTime()

      // Check if the name is typed and create article in the db
      if (admin.name !== '' && admin.username !== '') {
        await Admin.findOneAndUpdate(query, req.body, options, function(err, admin) {
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
  async updateUser(req, res) {
    try {
      let query = {_id: req.params.userId}
      let options = { upsert: true, new: true }

      let updatedUser = {}
      updatedUser.username = req.body.userUsername
      updatedUser.name = req.body.userName
      updatedUser.telephone1 = req.body.userTelephone1
      updatedUser.telephone2 = req.body.userTelephone2
      updatedUser.address = req.body.userAddress
      updatedUser.note = req.body.userNote
      updatedUser.userMenu = req.body.userMenu
      updatedUser.createdBy = req.body.createdBy

      // If image is added create image path
      if (req.file !== undefined && req.file !== '') {
        updatedUser.image = req.file.path
      }

      await User.findOneAndUpdate(query, updatedUser, options, function(err, user) {
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

  // Get User login List - just usernames and names
  async getUserLoginList(req, res) {
    try {
      await User.find()
        .select('-_id username name')
        .exec()
        .then(docs => {
          if (docs.length > 0) {
            res.send({
              users: docs
            })
          } else {
            res.send({
              noUsers: 'No users'
            })
          }
        })
        .catch(err => {
          console.log(err)
          res.status(500).send({
            error: 'An error has occurred trying to get the user list.'
          })
        })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occurred trying to get the list of staff members.'
      })
    }
  },

  // Get Admin login List - just usernames and names
  async getAdminLoginList(req, res) {
    try {
      // Find all admins except the root user/admin
      let query = { root: false }
      await Admin.find(query)
        .select('-_id username name')
        .exec()
        .then(docs => {
          if (docs.length > 0) {
            res.send({
              admins: docs
            })
          } else {
            res.send({
              noAdmins: 'No admins'
            })
          }
        })
        .catch(err => {
          console.log(err)
          res.status(500).send({
            error: 'An error has occurred trying to get the admin list.'
          })
        })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occurred trying to get the list of admins.'
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
  },

  // Delete User
  async deleteUser(req, res) {
    try {
      let query = {_id: req.params.userId}

      // Get image path
      let img = req.body.imgPath
      // Create full image path so it can be deleted with fs.unlink
      let fullImgPath = ''
      if (img !== '') {
        let dirPath = process.cwd()
        fullImgPath = dirPath + '/' + img
      }

      await User.remove(query, function(err) {
        if (err) {
          res.status(500).send({
            error: 'A database error has occurred trying to delete the user.'
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

        return res.send({
          deleted: true,
          success: 'User deleted.'
        })
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to delete the user.'
      })
    }
  }

} /* Module exports */
