const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

// var fileSchema = new Schema({
// 	_id: false, 
// 	id: { type: String, required: true },
// 	identifier: { type: String, required: true }
// })

// TODO: Create Inventory model and implement tracking of the current inventory in the cafe/store
const UserSchema = new Schema({
	roles: {					// 'user', 'admin' 'anon'
		type: Array,
		default: ['user']
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
  files: [{
		_id: false, 
		id: { type: String, required: true },
		identifier: { type: String, required: true }
	}],
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
	// TODO: Create permissions logic
	permissions: {
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

module.exports.hashPassword = async (password) => {
	return new Promise(async (resolve, reject) => {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) reject(err)

			bcrypt.hash(password, salt, (err, hash) => {
				if (err) reject(err)
				resolve(hash)
			})
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

module.exports.createUser = (user) => {
	return new Promise((resolve, reject) => {
		if (user.roles && user.roles.includes('root')) {
			let err = new Error('Creating a root user is not allowed')
			err.name = 'ForbiddenError'
			reject(err)
		}
		User.create(user, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}

// module.exports.createAdmin = (newAdmin, callback) => {
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) {
//       throw err
//     }
//     bcrypt.hash(newAdmin.password, salt, (err, hash) => {
//       if (err) {
//         throw err
//       }
//       newAdmin.password = hash
//       newAdmin.save(callback)
//     })
//   })
// }

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