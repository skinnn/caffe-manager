// Load .env config
require('dotenv').config()

module.exports = {
  port: process.env.PORT || 8080,
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017/vue-caffe'
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || '23wa8-113secc-0ccet1-2052'
  }
}
