const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SettingsSchema = new Schema({
  type: {
    type: String,
    default: 'settings'
  },
  store_name: {
    type: String,
    default: 'Sezame Store'
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
  updated_date: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }

}, { autoIndex: false })

let Settings = module.exports = mongoose.model('Settings', SettingsSchema)

// module.exports.getSettingsByAdminId = function(adminId, callback) {
//   Ssettings.findById(adminId, callback)
// }
