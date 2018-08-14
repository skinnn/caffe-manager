const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: String,
    default: ''
  }

})

let Admin = module.exports = mongoose.model('Admin', AdminSchema)

module.exports.createAdmin = function(newAdmin, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return console.log(err)
    }
    bcrypt.hash(newAdmin.password, salt, function(err, hash) {
      if (err) {
        console.log(err)
      }
      newAdmin.password = hash
      newAdmin.save(callback)
    })
  })
}

module.exports.getAdminByUsername = function(username, callback) {
  let query = {username: username}
  Admin.findOne(query, callback)
}

module.exports.getAdminById = function(id, callback) {
  Admin.findById(id, callback)
}

module.exports.compareAdminPassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err
    callback(null, isMatch)
  })
}
