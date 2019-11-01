// Load .env config
require('dotenv').config()

module.exports = {
  port: process.env.PORT || 9090,
  url: process.env.URL || '/api',
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017/vue-caffe'
  },
  authentication: {
    enabled: process.env.AUTH_ENABLED || true,
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
