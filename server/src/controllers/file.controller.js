const File = require('../models/File')

module.exports = {

	// Upload single file
  async createFile(req, res, next) {
    try {
			// TODO: Save file meta in the db
		
		} catch (err) {
			// TODO: Create and use error handler
			next(err)
		}
  }

} /* Module exports */
