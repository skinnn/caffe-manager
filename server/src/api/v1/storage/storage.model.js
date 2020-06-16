const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StorageSchema = new Schema({
	// TODO: Add user_id field
	name: {
		type: String,
		required: true
	},
	types: [{
		type: String,
		required: true,
		enum: ['main', 'secondary'] // TODO: Move to schema
	}],
	// TODO: Only active storages get listed in the Article/Order menu
	active: {
		type: Boolean,
		default: true
	},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: null }
})

let Storage = module.exports = mongoose.model('storage', StorageSchema)

module.exports.getStorageById = function(id, callback) {
	Storage.findById(id, callback)
}