const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

// TODO: Create Inventory model and implement tracking of the current inventory in the cafe/store
// TODO: When user is used replace user_id with user _id field
const UserSchema = new Schema({
	// built-in roles: 'user', 'admin' 'anon'
	roles: {
		type: Array,
		default: ['user']
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
		default: null
	},
	email: {
		type: String,
		default: null
	},
	phone: {
		type: String,
		default: null
	},
	address: {
		type: String,
		default: null
	},
	files: [{
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'file'
	}],
	note: {
		type: String,
		default: null
	},
	created_by: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	updated_by: {
		type: mongoose.Types.ObjectId,
		ref: 'user',
		default: null
	},
	created: { type: Date, default: Date.now },
	updated: { type: Date,	default: null }
})

const User = module.exports = mongoose.model('user', UserSchema)

module.exports.hashPassword = async (password) => {
	return new Promise((resolve, reject) => {
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