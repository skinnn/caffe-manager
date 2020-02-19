const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const AdminSchema = new Schema({
	userRoles: {
		type: Array,
		default: []
	},
  root: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    required: true,
    unique: true
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
  createdBy: {
    type: String,
    default: ''
	},
	note: {
    type: String,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
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

module.exports.getAdminByUsername = (username) => {
	return new Promise((resolve, reject) => {
		Admin.findOne({ username: username }, (err, admin) => {
			if (err) reject(err)
			resolve(admin)
		})
	})
}

module.exports.getAdminById = function(id, callback) {
  Admin.findById(id, callback)
}

module.exports.compareAdminPassword = (candidatePassword, hash) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
			if (err) reject(err)
			resolve(isMatch)
		})
	})
}
