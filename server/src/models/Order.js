const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
	// TODO: Add __owner field
	name: {
		type: String,
		required: true
	},
	inWhichTable: {
		type: String,
		required: true
	},
	ownerId: {
		type: String,
		required: true
	},
	updated_date: {
		type: String,
		default: ''
	},
	date: {
		type: Date,
		default: Date.now
	}

}, { autoIndex: false })

let Order = module.exports = mongoose.model('Order', OrderSchema)

// Get Orders by Table IDs
module.exports.getOrdersByTableIds = function(location, callback) {
	let query = {location: location}
	// eslint-disable-next-line
	Order.find(query, callback)
}