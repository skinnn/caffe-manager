const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StoreSettingsSchema = new Schema({
	// TODO: Add user_id field
	type: {
		type: String,
		default: null
	},
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

module.exports = StoreSettingsSchema

// const Setting = module.exports = mongoose.model('Setting', SettingSchema)

// module.exports.getSettingByAdminId = (adminId, callback) => {
//   Setting.findById(adminId, callback)
// }