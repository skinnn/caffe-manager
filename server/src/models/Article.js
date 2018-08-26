const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  inStorage: {
    type: String,
    required: true
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

let Article = module.exports = mongoose.model('Article', ArticleSchema)

module.exports.getArticleById = function(id, callback) {
  Article.findById(id, callback)
}
