const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleCategorySchema = new Schema({
	// TODO: Add user_id field
	name: {
		type: String,
		required: true
	},
	image_url: {
		type: String,
		default: null
	},
	storage_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'storage'
	},
	parent_category: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'article_category'
	},
	child_categories: [{
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'article_category'
	}],
	description: {
		type: String,
		default: null
	},
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: null	}
})

const ArticleCategory = module.exports = mongoose.model('article_category', ArticleCategorySchema)