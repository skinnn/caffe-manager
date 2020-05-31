const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StorageSchema = new Schema({
	// TODO: Add __owner field
	name: {
		type: String,
		required: true
	},
	// TODO: Only - 'Main' - storage is the storage from which Articles
	// get listed in the Article Menu and bill is printed
	type: {
		type: String,
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
}, { autoIndex: false })

let Storage = module.exports = mongoose.model('Storage', StorageSchema)

module.exports.getStorageById = function(id, callback) {
	Storage.findById(id, callback)
}