const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SettingsSchema = new Schema({
  type: {
    type: String,
    default: 'settings'
  },
  store_name: {
    type: String,
    default: ''
  },
  store_location: {
    type: String,
    default: ''
  },
  store_image: {
    type: String,
    default: ''
  },
  currency: {
    type: String,
    default: ''
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
