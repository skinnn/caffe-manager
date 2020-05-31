const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SettingSchema = new Schema({
	// TODO: Add __owner field
	type: {
		type: String,
		default: 'settings'
	},
	store_name: {
		type: String,
		default: 'Ses Store'
	},
	store_address: {
		type: String,
		default: 'Main St 24'
	},
	store_phone1: {
		type: String,
		default: '+341 111 111'
	},
	store_phone2: {
		type: String,
		default: '+341 222 222'
	},
	store_image: {
		type: String,
		default: ''
	},
	currency: {
		type: String,
		default: 'RSD'
	},
	// updated_by: {
	// 	type: String,
	// 	default: ''
	// },
	updated_date: {
		type: String,
		default: ''
	},
	date: {
		type: Date,
		default: Date.now
	}

}, { autoIndex: false })

const Setting = module.exports = mongoose.model('Setting', SettingSchema)

// module.exports.getSettingByAdminId = (adminId, callback) => {
//   Setting.findById(adminId, callback)
// }