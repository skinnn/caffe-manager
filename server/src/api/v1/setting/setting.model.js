const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SettingStoreSchema = new Schema({
	// TODO: Add user_id field
	type: {
		type: String,
		default: null
	},
	setting_id: {
		type: String,
		default: null
	},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	created: { type: Date, default: Date.now },
	updated: { type: String, default: null }
})

module.exports = SettingStoreSchema = mongoose.model('setting_store', SettingStoreSchema)

// const Setting = module.exports = mongoose.model('Setting', SettingSchema)

// module.exports.getSettingByAdminId = (adminId, callback) => {
//   Setting.findById(adminId, callback)
// }