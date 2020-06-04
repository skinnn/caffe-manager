
module.exports = {
	dev_url: process.env.DEV_URL || 'http://localhost:9090/api',
	prod_url: process.env.PROD_URL || 'http://some-production-url',
	
	// TODO: Auth should always be true in production mode
	authentication: {
		admin: process.env.ADMIN_AUTH_ENABLED || true,
		user: process.env.USER_AUTH_ENABLED || true
	}
}
