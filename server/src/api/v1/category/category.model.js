const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CategorySchema = new Schema({
	name: {
		type: String,
		required: true
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
	// parent_category: {
	// 	type: ObjectId,
	// 	ref: 'category',
	// 	required: true
	// },
	// child_categories: [{
	// 	type: ObjectId,
	// 	ref: 'category',
	// 	required: true
	// }],
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: null	}
})

const Category = module.exports = mongoose.model('category', CategorySchema)