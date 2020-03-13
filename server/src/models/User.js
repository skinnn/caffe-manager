const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

// TODO: Create Inventory model and implement tracking of the current inventory in the cafe/store
const UserSchema = new Schema({
	roles: {					// 'user', 'admin' 'anon'
		type: Array,
		default: []
	},
  root: {
    type: Boolean,
    default: false
  },
  username: {				// Required
    type: String,
		required: true,
		trim: true,
    unique: true
  },
  name: {
		type: String,
		trim: true,
		default: null
  },
  password: {
		type: String,
		trim: true,
    required: true
	},
	email: {
		type: String,
		trim: true,
		default: null
	},
  files: {
		type: Array,
		default: []
  },
  phone: {
		type: String,
		trim: true,
    default: null
  },
  address: {
		type: String,
		trim: true,
    default: null
	},
	permissions: { 		// TODO: Create permissions logic
    type: Array,
    default: []
	},
	// userMenu: {
  //   type: Array,
  //   default: []
	// },
	// telephone2: {
  //   type: String,
  //   default: null
  // },
  note: {
		type: String,
		trim: true,
    default: null
  },
  createdBy: {
		type: String,
		trim: true,
    default: null
  },
  created: {
		type: Date,
		required: true,
    default: Date.now
  },
  updated: {
    type: Date,
    default: null
  }
})

let User = module.exports = mongoose.model('User', UserSchema)

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      throw err
    }
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        throw err
      }
      newUser.password = hash
      newUser.save(callback)
    })
  })
}

module.exports.createAdmin = (newAdmin, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      throw err
    }
    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
      if (err) {
        throw err
      }
      newAdmin.password = hash
      newAdmin.save(callback)
    })
  })
}

module.exports.getUserByUsername = (username) => {
	return new Promise((resolve, reject) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) reject(err)
			resolve(user)
		})
	})
}

module.exports.getUserById = (id) => {
	return new Promise((resolve, reject) => {
		User.findById({ _id: id }, (err, user) => {
			if (err) reject(err)
			resolve(user)
		})
	})
}

module.exports.compareUserPassword = (candidatePassword, hash) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
			if (err) reject(err)
			resolve(isMatch)
		})
	})
}