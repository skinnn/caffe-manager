const Storage = require('./storage.model')

module.exports = {

	// Create Storage
	async createStorage(req, res, next) {
		try {
			let storage = new Storage()
			storage.name = req.body.storageName
			storage.type = req.body.type
			// TODO: Do validation with Joi
			// Validation
			if (storage.name !== '' && storage.type !== '') {
				await storage.save((err) => {
					if (err) throw err
					return res.status(201).json({
						saved: true,
						success: 'Storage created.'
					})
				})
			} else {
				return res.status(400).json({
					error: 'Please fill out all required fields.'
				})
			}
		} catch (err) {
			return next(err)
		}
	},

	// Get All Storages
	async getAllStorages(req, res, next) {
		try {
			await Storage.find({}, (err, storages) => {
				if (err) throw err
				return res.status(200).json({
					storages: storages
				})
			})
		} catch (err) {
			return next(err)
		}
	},

	// Get Storage by id
	async getStorageById(req, res, next) {
		try {
			let query = req.params.storageId
			await Storage.getStorageById(query, (err, storage) => {
				if (err) throw err
				return res.status(200).json({
					storage: storage
				})
			})
		} catch (err) {
			return next(err)
		}
	},

	// Update Storage by id
	async saveStorage(req, res, next) {
		try {
			let query = {_id: req.params.storageId}

			await Storage.findOneAndUpdate(query, req.body, (err, storage) => {
				if (err) throw err
				return res.status(200).json({
					storage: storage
				})
			})
		} catch (err) {
			return next(err)
		}
	}

} /* Module exports */