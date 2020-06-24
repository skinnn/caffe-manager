const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const TableSchema = new Schema({
	number: {
		type: Number,
		required: true
	},
	user_id: {
		type: ObjectId,
		ref: 'user',
		required: true
	},
	active: {
		type: Boolean,
		required: true
	},
	date: { type: Date, default: Date.now },
	updated: { type: Date, default: null }
})

const Table = module.exports = mongoose.model('table', TableSchema)