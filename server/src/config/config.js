/**
 * Master configuration file
 */

// Load env variables
const env = require('dotenv').config()

module.exports = {
	host: 'localhost',
	protocol: 'http',
	port: env.PORT || 9090,
	baseApiURL: env.BASE_API_URL || '/api',

	rootUser: {
		username: 'admin',
		password: '123123'
	},
	db: {
		uri: env.DB_URI || 'mongodb://localhost:27017/caffe_manager',
		conn: null
	},
	authentication: {
		enabled: env.AUTH_ENABLED || true,
		jwtSecret: env.JWT_SECRET || 'secret',
		sessionSecret: env.JWT_SECRET || 'session_secret'
	},

	server: null
}