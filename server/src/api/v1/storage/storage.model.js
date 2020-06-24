const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const StorageSchema = new Schema({
	// TODO: Add user_id field
	name: {
		type: String,
		unique: true,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	// TODO: Only active storages get listed in the Article/Order menu
	active: {
		type: Boolean,
		default: true
	},
	user_id: {
		type: ObjectId,
		ref: 'user',
		required: true
	},
	updated_by: {
		type: ObjectId,
		ref: 'user',
		default: null
	},
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: null }
})

let Storage = module.exports = mongoose.model('storage', StorageSchema)

module.exports.getStorageById = function(id, callback) {
	Storage.findById(id, callback)
}