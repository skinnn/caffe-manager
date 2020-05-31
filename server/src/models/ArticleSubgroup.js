const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleSubgroupSchema = new Schema({
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

let ArticleSubgroup = module.exports = mongoose.model('ArticleSubgroup', ArticleSubgroupSchema)

// module.exports.getSubgroupsByStorageId = function(id, callback) {
//   ArticleSubgroup.findById(id, callback)
// }