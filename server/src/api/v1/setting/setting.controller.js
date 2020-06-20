const Setting = require('./setting.model')

class SettingController {

	// Create settings
	async createSettings(req, res, next) {
		try {
			let setting = new Setting(req.body)
			// let query = {}
			// let update = { type: 'settings' }
			// let options = { upsert: true, new: true, setDefaultsOnInsert: true }

			// await Setting.findOneAndUpdate(query, update, options, (err, settings) => {
			// 	if (err) throw err
			// 	return res.status(200).json({
			// 		settings: settings
			// 	})
			// })
		} catch (err) {
			return next(err)
		}
	},

	// Update  Settings
	async updateSettings(req, res, next) {
		try {
			let query = { type: 'settings' }
			let options = { upsert: true, new: true }

		} catch (err) {
			return next(err)
		}
	}

}

module.exports = SettingController