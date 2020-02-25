const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

// TODO: Modify user model similar to updated admin model, add regexes, move errors to the fields
// TODO: Create Inventory model and implement tracking of the current inventory in the cafe/store
const UserSchema = new Schema({
  // userType: {
  //   type: String,
  //   default: 'user'
	// },
	userRoles: {
		type: Array,
		default: [] // 'user', 'admin' 'anon'
	},
  root: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    required: true
    // unique: true
  },
  name: {
    type: String
  },
  password: {
    type: String,
    required: true
	},
	email: {
		type: String,
		default: null
	},
  image: {
    type: String
  },
  telephone1: {
    type: String,
    default: null
  },
  telephone2: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
	},
	// permissions: {
  //   type: String,
  //   default: null
	// },
	userMenu: {
    type: Array,
    default: []
  },
  note: {
    type: String,
    default: null
  },
  createdBy: {
    type: String,
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: String,
    default: null
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

// module.exports.getUserByUsername = function(username, callback) {
//   let query = {username: username}
//   User.findOne(query, callback)
// }

module.exports.getUserByUsername = (username) => {
	return new Promise((resolve, reject) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) reject(err)
			resolve(user)
		})
	})
}

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback)
}

module.exports.compareUserPassword = (candidatePassword, hash) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
			if (err) reject(err)
			resolve(isMatch)
		})
	})
}

// module.exports.compareUserPassword = function(candidatePassword, hash, callback) {
//   bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
//     if (err) throw err
//     callback(null, isMatch)
//   })
// }
