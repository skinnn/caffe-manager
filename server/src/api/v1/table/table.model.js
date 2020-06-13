const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TableSchema = new Schema({
	// TODO: Add user_id field
	number: {
		type: Number,
		required: true,
		unique: true
	},
	user_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	active: {
		type: Boolean,
		default: false
	},
	date: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: String,
		default: ''
	}
})

let Table = module.exports = mongoose.model('Table', TableSchema)