/**
 * Master configuration file
 */

// Load env variables
const env = require('dotenv').config()

module.exports = {
  port: env.PORT || 9090,
	baseApiURL: env.BASE_API_URL || '/api',
	rootUser: {
		username: 'admin',
		password: '123123'
	},
  db: {
    uri: env.DB_URI || 'mongodb://localhost:27017/caffe_manager'
  },
  authentication: {
    enabled: env.AUTH_ENABLED || true,
    jwtSecret: env.JWT_SECRET || 'secret'
  }
}
