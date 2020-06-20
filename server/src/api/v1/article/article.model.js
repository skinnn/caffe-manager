const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	code: {
		type: Number,
		required: true
	},
	storage_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'storage'
	},
	visible: {
		type: Boolean,
		default: true
	},
	quantity: {
		type: Number,
		required: true
	},
	reserved_quantity: {
		type: Number,
		default: null
	},
	purchase_price: {
		type: Number,
		required: true
	},
	selling_price: {
		type: Number,
		default: null
	},
	sale_price: {
		type: Number,
		default: null
	},
	article_categories: [{
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'article_category'
	}],
	image_url: {
		type: String,
		default: null
	},
	description: {
		type: String,
		default: null
	},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: null },
	updated_by: { type: String, default: null }

})

let Article = module.exports = mongoose.model('article', ArticleSchema)

module.exports.getArticleById = function(id, callback) {
	Article.findById(id, callback)
}