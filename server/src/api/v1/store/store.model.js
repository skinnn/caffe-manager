const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StoreSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	address: {
		type: String,
		default: null
	},
	phone_1: {
		type: String,
		default: null
	},
	phone_2: {
		type: String,
		default: null
	},
	files: {
		type: Array,
		default: []
	},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	updated_by: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		default: null
	},
	created: { type: Date, default: Date.now },
	updated: { type: String, default: null }
})

const Store = module.exports = mongoose.model('store', StoreSchema)