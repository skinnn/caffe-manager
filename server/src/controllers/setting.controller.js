const Setting = require('../models/Setting')
const helpers = require('../lib/helpers')

module.exports = {

	// Get or Create Admin Settings if it doesn't exist
	async getOrCreateStoreSettings(req, res, next) {
		try {
			let query = {}
			let update = { type: 'settings' }
			let options = { upsert: true, new: true, setDefaultsOnInsert: true }

			await Setting.findOneAndUpdate(query, update, options, (err, settings) => {
				if (err) throw err
				return res.status(200).json({
					settings: settings
				})
			})
		} catch (err) {
			return next(err)
		}
	},

	// Update Store Settings
	async updateStoreSettings(req, res, next) {
		try {
			let query = { type: 'settings' }
			let options = { upsert: true, new: true }

			let settings = {}
			settings.store_name = req.body.storeName
			settings.store_address = req.body.storeAddress
			settings.currency = req.body.storeCurrency
			settings.store_phone1 = req.body.storePhone1
			settings.store_phone2 = req.body.storePhone2
			settings.updated_date = helpers.getCurrentTime()

			// TODO: File upload on /file endpoint
			// If image is changed update the image path
			if (req.file !== undefined && req.file !== '') {
				// TODO: If there is previous store image delete it from the images folder
				settings.store_image = req.file.path
			} else {
				// If there is no new image
				settings.store_image = req.body.oldImage
			}

			await Setting.findOneAndUpdate(query, settings, options, (err, settings) => {
				if (err) throw err
				return res.status(200).json({
					saved: true,
					settings: settings,
					success: 'Settings updated successfully.'
				})
			})
		} catch (err) {
			return next(err)
		}
	}

} /* Module exports */