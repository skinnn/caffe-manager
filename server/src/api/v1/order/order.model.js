const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleSchema = require('./Article')

const OrderSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	table_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Table'
	},
	user_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	// articles: [ArticleSchema],
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: null },

})

let Order = module.exports = mongoose.model('Order', OrderSchema)

// Get Orders by Table IDs
module.exports.getOrdersByTableIds = (location, callback) => {
	let query = { location: location }
	Order.find(query, callback)
}