const File = require('../models/File')

module.exports = {

	// Upload single file
	async createFile(req, res, next) {
		try {
			// TODO: Save file meta in the db
		
		} catch (err) {
			return next(err)
		}
	}

} /* Module exports */