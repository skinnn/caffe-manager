const Store = require('./store.model')

module.exports = {

	// Create store (initialize)
	async createStoreSettings() {
		try {
			const store = new Store()
		} catch (err) {
			return next(err)
		}
	}

} /* Module exports */