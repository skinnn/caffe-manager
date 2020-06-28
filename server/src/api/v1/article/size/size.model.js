const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const SizeSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		default: null
	},
	bottle_capacity: {
		type: Number,
		default: null
	},
	portion_size: {
		type: Number,
		default: null
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
	updated: { type: Date, default: null },
})

const Size = module.exports = mongoose.model('size', SizeSchema)