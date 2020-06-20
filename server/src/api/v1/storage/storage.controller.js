const Controller = require('../../../lib/Controller')

const Storage = require('./storage.model')
const StorageJSONSchema = require('./storage.schema.json')

class StorageController extends Controller {

	// Create Storage
	static async createStorage(req, res, next) {
		try {
			const error = Controller.validateToSchema(StorageJSONSchema, req.body)
			if (error) {
				let err = new Error(error); err.name = 'BadRequestError';
				throw err
			}

			const exist = await Storage.findOne({ name: req.body.name }) 
			if (exist) {
				return res.status(400).json({
					message: `Storage with name ${req.body.name} already exist`
				})
			}

			let storage = new Storage()
			storage.name = req.body.name
			storage.type = req.body.type
			storage.active = req.body.active

			storage.user_id = req.user.id

			const savedStorage = await storage.save()
			res.locals = {
				status: 201,
				json: { storage: savedStorage }
			}

			return next()
		} catch (err) {
			return next(err)
		}
	}

	// Get All Storages
	static async getAllStorages(req, res, next) {
		try {
			const query = {}

			const storages = await Storage.find(query)
			
			res.locals = {
				status: 200,
				json: storages
			}

			return next()
		} catch (err) {
			return next(err)
		}
	}

	// Get Storage by id
	static async getStorageById(req, res, next) {
		try {
			let query = req.params.id

			const storage = await Storage.findById(query)

			res.locals = {
				status: 200,
				json: storage
			}

			return next()

			// await Storage.getStorageById(query, (err, storage) => {
			// 	if (err) throw err
			// 	return res.status(200).json({
			// 		storage: storage
			// 	})
			// })
		} catch (err) {
			return next(err)
		}
	}

	// Update Storage by id
	static async updateStorage(req, res, next) {
		try {
			let query = {_id: req.params.id}

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

}

module.exports = StorageController