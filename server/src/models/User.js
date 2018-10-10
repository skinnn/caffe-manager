const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
  userType: {
    type: String,
    default: 'user'
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String
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
  permissions: {
    type: String,
    default: ''
  },
  userMenu: {
    type: Array,
    required: true
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

let User = module.exports = mongoose.model('User', UserSchema)

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return console.log(err)
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

module.exports.getUserByUsername = function(username, callback) {
  let query = {username: username}
  User.findOne(query, callback)
}

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback)
}

module.exports.compareUserPassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err
    callback(null, isMatch)
  })
}
