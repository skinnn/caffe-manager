const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleInfoSchema = new Schema({
	article_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'article'
	},
	tax_rate: {
		type: Number,
		default: null
	},
	average_price: {
		type: Number,
		default: null
	},
	total_sold: {
		type: Number,
		default: null
	},
	updated_by: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'user'
	},
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: null }

})

const ArticleInfo = module.exports = mongoose.model('article_Info', ArticleInfoSchema)