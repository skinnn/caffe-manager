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
  retail_price: {
    type: Number
  },
  // TODO: Profits can be calculated based on how many articles are sold per day||month||year
  // TODO: Add some kind of measurement for drinks - ml, dcl, cup, bottle
  image: {
    type: String
  },
  inStorage: {
    type: String,
    required: true
  },
  subgroup_name: {
    type: String,
    required: true
  },
  subgroup_id: {
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
