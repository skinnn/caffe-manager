const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LoginSchema = new Schema({
  user: {
    type: String,
    required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	token: {
		type: String,
		required: true
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

const Login = module.exports = mongoose.model('Login', LoginSchema)

// module.exports.createAdmin = function(newAdmin, callback) {
//   bcrypt.genSalt(10, function(err, salt) {
//     if (err) {
//       return console.log(err)
//     }
//     bcrypt.hash(newAdmin.password, salt, function(err, hash) {
//       if (err) {
//         console.log(err)
//       }
//       newAdmin.password = hash
//       newAdmin.save(callback)
//     })
//   })
// }

// module.exports.getAdminByUsername = function(username, callback) {
//   let query = {username: username}
//   Admin.findOne(query, callback)
// }

// module.exports.getAdminById = function(id, callback) {
//   Admin.findById(id, callback)
// }

// module.exports.compareAdminPassword = function(candidatePassword, hash, callback) {
//   bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
//     if (err) throw err
//     callback(null, isMatch)
//   })
// }
