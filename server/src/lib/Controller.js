const mongoose = require('mongoose')
const UserController = require('../controllers/user.controller')

class Controller {
	constructor(api, app) {
		this.api = api
		this.app = app
	}

	/**
	 * 
	 * @param {Object} 			masterConfig 		[Master configuration file]
	 * @param {Function} 		app 						[Express app instance]
	 */
	static async boot(masterConfig, app) {
		// Controller.modify(Controller.api, masterConfig)
		Controller.api = masterConfig
		Controller.app = app
		
		try {
			await Controller.bootActions()
			Controller.api.db.conn = mongoose.connection.db

			return this
		} catch (err) {
			throw err
		}
	}

	static async bootActions() {
		try {
			// Connect to a local MongoDB
			await mongoose
				.connect(Controller.api.db.uri, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false, // Fixing deprecation for findOneAndUpdate() query
					useCreateIndex: true
				})
			console.log('MongoDB connected')

			// Create root admin if it does not exist
			await UserController.createRootAdmin()
		} catch (err) {
			throw err
		}
	}

	static modify(obj, newObj) {
		Object.keys(obj).forEach((key) => delete obj[key])
    Object.keys(newObj).forEach((key) => obj[key] = newObj[key])
	}

	static logError(err) {
		console.error('Error: ', err)
	}
}

module.exports = Controller