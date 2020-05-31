const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleCategorySchema = new Schema({
	// TODO: Add __owner field
	name: {
		type: String,
		required: true
	},
	image: {
		type: String
		// TODO: required: true
	},
	inWhichStorage: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	updated_date: {
		type: String,
		default: ''
	}
}, { autoIndex: false })

const ArticleCategory = module.exports = mongoose.model('article_category', ArticleCategorySchema)

// module.exports.getSubgroupsByStorageId = function(id, callback) {
//   ArticleCategory.findById(id, callback)
// }