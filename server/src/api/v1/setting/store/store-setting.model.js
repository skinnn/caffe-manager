const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StoreSettingsSchema = new Schema({
	// TODO: Add user_id field
	general: {
		type: Object,
		default: {
			currency: { type: String, required: true },
			phone_1: { type: String, default: null },
			phone_2: {	type: String,	default: null	},
			coordinate_lat: {	type: Schema.Types.Decimal128,	default: null	},
			coordinate_long: {	type: Schema.Types.Decimal128,	default: null	}
		}
	},
	tax: {
		type: Object,
		default: {
			rate: { type: Number, default: null },
			display_suffix: { type: String, default: null }
		}
	},
	updated_by: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		default: null
	},
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: null }
})

module.exports = StoreSettingsSchema

// const Setting = module.exports = mongoose.model('Setting', SettingSchema)

// module.exports.getSettingByAdminId = (adminId, callback) => {
//   Setting.findById(adminId, callback)
// }