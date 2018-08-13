const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  permissions: {
    type: String,
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

module.exports = mongoose.model('User', UserSchema)

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      console.log(err)
    }
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      if (err) {
        console.log(err)
      }
      newUser.password = hash
      newUser.save(callback)
    })
  })
}

/* eslint-disable */
module.exports.getUserByUsername = function(username, callback) {
  let query = {username: username}
  User.findOne(query, callback)
}

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback)
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if(err) throw err
    callback(null, isMatch)
  })
}
/* eslint-enable */
