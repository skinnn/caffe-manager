const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StoreSchema = new Schema({
	name: {
		type: String,
		default: null
	},
	address: {
		type: String,
		default: null
	},
	phone_1: {
		type: String,
		default: null
	},
	phone_2: {
		type: String,
		default: null
	},
	logo_url: {
		type: String,
		default: null
	},
	currency: {
		type: String,
		default: null
	},
	create: { type: Date, default: Date.now },
	updated: { type: String, default: null }
})

module.exports = StoreSchema

const Store = module.exports = mongoose.model('Store', StoreSchema)