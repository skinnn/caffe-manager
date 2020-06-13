const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StorageSchema = new Schema({
	// TODO: Add user_id field
	name: {
		type: String,
		required: true
	},
	// TODO: Only - 'Main' - storage is the storage from which Articles
	// get listed in the Article Menu and bill is printed
	types: [{
		type: String,
		required: true,
		enum: ['main', 'secondary']
	}],
	user_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: null }
})

let Storage = module.exports = mongoose.model('Storage', StorageSchema)

module.exports.getStorageById = function(id, callback) {
	Storage.findById(id, callback)
}