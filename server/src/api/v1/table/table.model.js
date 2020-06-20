const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TableSchema = new Schema({
	number: {
		type: Number,
		required: true,
		unique: true
	},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	active: {
		type: Boolean,
		default: false
	},
	date: { type: Date, default: Date.now },
	updated: { type: Date, default: null }
})

const Table = module.exports = mongoose.model('table', TableSchema)