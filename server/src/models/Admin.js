const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const AdminSchema = new Schema({
  userType: {
    type: String,
    required: true
    // default: 'admin'
  },
  root_user: {
    type: Boolean,
    required: true
    // default: true
  },
  username: {
    type: String,
    required: true,
    unique: true
    // default: 'admin'
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  telephone1: {
    type: String,
    default: ''
  },
  telephone2: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  note: {
    type: String,
    default: ''
  },
  createdBy: {
    type: Object,
    default: ''
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
