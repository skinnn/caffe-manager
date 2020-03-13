// Models
const Admin = require('../models/Admin')
const User = require('../models/User')
// Modules
const bcrypt = require('bcryptjs')
const fs = require('fs')
const dateHandler = require('./getDate')

module.exports = {

	// Create Admin
  async createAdmin(req, res) {
    try {
      const image = req.file !== undefined && req.file !== '' ? req.file.path : ''

      // Create new admin object
      const newAdmin = new Admin({
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

  // // Get Admins
  // async getAllAdmins(req, res) {
  //   try {
  //     await Admin.find({}, function(err, admins) {
  //       if (err) {
  //         console.log(err)
  //       } else {
  //         res.send({
  //           admins: admins
  //         })
  //       }
  //     })
  //   } catch (err) {
  //     res.status(500).send({
  //       error: 'An error has occurred trying to get the list of admins.'
  //     })
  //   }
  // },

  // // Get Admin by id
  // async getAdminById(req, res) {
  //   try {
  //     let query = req.params.adminId
  //     await Admin.getAdminById(query, function(err, admin) {
  //       if (err) {
  //         console.log(err)
  //       } else {
  //         res.send({
  //           admin: admin
  //         })
  //       }
  //     })
  //   } catch (err) {
  //     res.status(500).send({
  //       error: 'An error has occurred trying to get the admin data.'
  //     })
  //   }
  // },

  // Update Admin by id
  async updateAdminById(req, res) {
    try {
      let query = {_id: req.params.adminId}
      let options = { upsert: true, new: true }

      let admin = {}
      admin.name = req.body.name
      admin.username = req.body.username
      // TODO: Implement editing admin password
      // admin.password = req.body.password
      admin.updated_date = dateHandler.getCurrentTime()

      // Check if the name is typed and create article in the db
      if (admin.name !== '' && admin.username !== '') {
        await Admin.findOneAndUpdate(query, req.body, options, (err, admin) => {
          if (err) {
						throw err
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

  // // Get all Users
  // async getAllUsers(req, res) {
  //   try {
  //     await User.find({}, function(err, users) {
  //       if (err) {
  //         console.log(err)
  //       } else {
  //         res.send({
  //           users: users
  //         })
  //       }
  //     })
  //   } catch (err) {
  //     console.log(err)
  //     res.status(500).send({
  //       error: 'An error has occurred trying to get the list of staff members.'
  //     })
  //   }
  // },

  // // Get User by id
  // async getUserById(req, res) {
  //   try {
  //     let query = req.params.userId
  //     await User.getUserById(query, function(err, user) {
  //       if (err) {
  //         console.log(err)
  //       } else {
  //         res.send({
  //           user: user
  //         })
  //       }
  //     })
  //   } catch (err) {
  //     res.status(500).send({
  //       error: 'An error has occurred trying to get the admin data.'
  //     })
  //   }
  // },

  // // Update User by id
  // async updateUser(req, res) {
  //   try {
  //     let query = {_id: req.params.userId}
  //     let options = { upsert: true, new: true }

  //     let updatedUser = {}
  //     updatedUser.username = req.body.userUsername
  //     updatedUser.name = req.body.userName
  //     updatedUser.telephone1 = req.body.userTelephone1
  //     updatedUser.telephone2 = req.body.userTelephone2
  //     updatedUser.address = req.body.userAddress
  //     updatedUser.note = req.body.userNote
  //     updatedUser.userMenu = req.body.userMenu
  //     updatedUser.createdBy = req.body.createdBy

  //     // If image is added create image path
  //     if (req.file !== undefined && req.file !== '') {
  //       updatedUser.image = req.file.path
  //     }

  //     await User.findOneAndUpdate(query, updatedUser, options, function(err, user) {
  //       if (err) {
  //         console.log(err)
  //       } else {
  //         res.send({
  //           user: user
  //         })
  //       }
  //     })
  //   } catch (err) {
  //     res.status(500).send({
  //       error: 'An error has occurred trying to update the user data.'
  //     })
  //   }
  // },

  // // Get User login List - just usernames and names
  // async getUserLoginList(req, res) {
  //   try {
  //     await User.find()
  //       .select('-_id username name')
  //       .exec()
  //       .then(docs => {
  //         if (docs.length > 0) {
  //           res.send({
  //             users: docs
  //           })
  //         } else {
  //           res.send({
  //             noUsers: 'No users'
  //           })
  //         }
  //       })
  //       .catch(err => {
  //         console.log(err)
  //         res.status(500).send({
  //           error: 'An error has occurred trying to get the user list.'
  //         })
  //       })
  //   } catch (err) {
  //     console.log(err)
  //     res.status(500).send({
  //       error: 'An error has occurred trying to get the list of staff members.'
  //     })
  //   }
  // },

  // // Get Admin login List - just usernames and names
  // async getAdminLoginList(req, res) {
  //   try {
  //     // Find all admins except the root user/admin
  //     let query = { root: false }
  //     await Admin.find(query)
  //       .select('-_id username name')
  //       .exec()
  //       .then(docs => {
  //         if (docs.length > 0) {
  //           res.send({
  //             admins: docs
  //           })
  //         } else {
  //           res.send({
  //             noAdmins: 'No admins'
  //           })
  //         }
  //       })
  //       .catch(err => {
  //         console.log(err)
  //         res.status(500).send({
  //           error: 'An error has occurred trying to get the admin list.'
  //         })
  //       })
  //   } catch (err) {
  //     console.log(err)
  //     res.status(500).send({
  //       error: 'An error has occurred trying to get the list of admins.'
  //     })
  //   }
  // },

  // // Delete Admin
  // async deleteAdmin(req, res) {
  //   try {
  //     let query = {_id: req.params.adminId}

  //     // Get image path
  //     let img = req.body.imgPath
  //     // Create full image path so it can be deleted with fs.unlink
  //     let fullImgPath = ''
  //     if (img !== '') {
  //       let dirPath = process.cwd()
  //       fullImgPath = dirPath + '/' + img
  //     }

  //     await Admin.deleteOne(query, function(err) {
  //       if (err) {
  //         res.status(500).send({
  //           error: 'A database error has occurred trying to delete the admin.'
  //         })
  //       }
  //       if (fullImgPath !== '') {
  //         fs.unlink(fullImgPath, function(err) {
  //           if (err) {
  //             res.status(500).send({
  //               error: 'An error has occurred trying to delete the image.'
  //             })
  //           }
  //         })
  //       }
  //       res.send({
  //         deleted: true,
  //         success: 'Admin deleted.'
  //       })
  //     })
  //   } catch (err) {
  //     res.status(500).send({
  //       error: 'An error has occurred trying to delete the admin.'
  //     })
  //   }
  // },

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

      await User.deleteOne(query, function(err) {
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
