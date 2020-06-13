const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleInfoSchema = new Schema({
	article_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Article'
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
		ref: 'User'
	},
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: null }

})

const ArticleInfo = module.exports = mongoose.model('Article_Info', ArticleInfoSchema)