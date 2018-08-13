const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reservedArticleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  inWhichOrder: {
    type: String
    // required: true
  },
  image: {
    type: String
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

module.exports = mongoose.model('reservedArticle', reservedArticleSchema)
