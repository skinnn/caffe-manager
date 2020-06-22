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
			const storages = await Storage
				.find(req.queryParsed.match)
				.populate(req.queryParsed.include)
				.select(req.queryParsed.fields)
				.limit(req.queryParsed.limit)
				.sort(req.queryParsed.sort)
			
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
			const query = req.params.id
			const include = req.queryParsed.include

			const storage = await Storage.findById(query).populate(include)

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
			const query = {_id: req.params.id}
			const include = req.queryParsed.include

			const options = { new: true }
			const data = req.body
			
			// Validate body
			const modifiedSchema = StorageJSONSchema
			modifiedSchema.required = []
			const error = Controller.validateToSchema(modifiedSchema, req.body)
			if (error) throw new Error(error)

			// const storageToUpdate = await Storage.findOne(query)

			data.updated = new Date(Date.now()).toString()
			data.updated_by = req.user.id
			const	updatedStorage = await Storage.findOneAndUpdate(query, data, options).populate(include)

			res.locals = {
				status: 200,
				json: { storage: updatedStorage }
			}
			
			return next()
		} catch (err) {
			return next(err)
		}
	}

}

module.exports = StorageController