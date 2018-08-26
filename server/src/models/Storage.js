const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StorageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: String,
    default: ''
  }
}, { autoIndex: false })

let Storage = module.exports = mongoose.model('Storage', StorageSchema)

module.exports.getStorageById = function(id, callback) {
  Storage.findById(id, callback)
}
