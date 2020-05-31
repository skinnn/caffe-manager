const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reservedArticleSchema = new Schema({
	// TODO: Add __owner field
	name: {
		type: String,
		required: true
	},
	quantity: {
		type: Number,
		required: true
	},
	price: {
		type: String,
		required: true
	},
	total_price: {
		type: String,
		required: true
	},
	inWhichOrder: {
		type: String,
		required: true
	},
	inWhichTable: {
		type: String,
		required: true
	},
	reservedBy: {
		type: String,
		required: true
	},
	image: {
		type: String
	},
	updated_date: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now
	}

}, { autoIndex: false })

let reservedArticle = module.exports = mongoose.model('reservedArticle', reservedArticleSchema)