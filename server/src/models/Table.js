const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const TableSchema = new Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  active: {
    type: Boolean,
    default: false
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

let Table = module.exports = mongoose.model('Table', TableSchema)
