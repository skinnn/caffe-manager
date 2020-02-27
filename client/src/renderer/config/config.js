module.exports = {
	node_env: process.env.NODE_ENV || 'development',
	// TODO: Implement auth_enabled (and set to always be true in production mode)
	auth_enabled: process.env.AUTH_ENABLED || true,
	dev_url: process.env.DEV_URL || 'http://localhost:9090/api',
	prod_url: process.env.PROD_URL || 'http://some-production-url'
}
