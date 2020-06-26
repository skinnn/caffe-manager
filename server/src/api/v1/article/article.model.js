const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Decimal128 = Schema.Types.Decimal128

// TODO: User can send request to the admin, asking to remove article from the reserved list (from the order)
const ArticleSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	code: {
		type: Number,
		required: true
	},
	units_in_stock: {
		type: Number,
		required: true
	},
	purchase_price: {
		type: Decimal128,
		default: null
	},
	selling_price: {
		type: Decimal128,
		required: true
	},
	sale_price: {
		type: Decimal128,
		default: null
	},
	available: {
		type: Boolean,
		default: true
	},
	image_id: {
		type: ObjectId,
		ref: 'file',
		default: null
	},
	description: {
		type: String,
		default: null
	},
	categories: [{
		type: ObjectId,
		ref: 'category',
		required: true
	}],
	storage_id: {
		type: ObjectId,
		ref: 'storage',
		required: true
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

const Article = module.exports = mongoose.model('article', ArticleSchema)

// module.exports.getArticleById = function(id, callback) {
// 	Article.findById(id, callback)
// }