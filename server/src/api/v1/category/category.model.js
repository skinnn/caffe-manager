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
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Storage'
	},
	parent_category: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Article_Category'
	},
	child_categories: [{
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Article_Category'
	}],
	description: {
		type: String,
		default: null
	},
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: null	}
})

const ArticleCategory = module.exports = mongoose.model('Article_Category', ArticleCategorySchema)