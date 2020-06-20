const Store = require('./store.model')
const StoreJSONSchema = require('./store.schema.json')

const Controller = require('../../../lib/Controller')

class StoreController extends Controller {

	// Create store
	static async createStore(req, res, next) {
		try {
			// Validate to JSON schema
			const error = Controller.validateToSchema(StoreJSONSchema, req.body)
			if (error) {
				return res.status(400).json({
					message: error
				})
			}

			const storeExist = await Store.findOne({ name: req.body.name })
			if (storeExist) {
				return res.status(400).json({
					message: `Store with name ${req.body.name} already exist`
				})
			}

			const store = new Store(req.body)
			store.user_id = req.user.id

			const savedStore = await store.save()

			return res.status(201).json({
				store: savedStore
			})
		} catch (err) {
			return next(err)
		}
	}

	static async getAllStores(req, res, next) {
		try {
			const fields = req.queryParsed.fields
			const sort = req.queryParsed.sort
			const include = req.queryParsed.include

			const stores = await Store.find({}).populate(include).select(fields).sort(sort)

			const authorized = Controller.validateOwnership(req, stores)
			if (authorized) {
				return res.status(200).json({
					stores: stores
				})
			}
		} catch (err) {
			return next(err)
		}
	}

	static async getStoreById(req, res, next) {
		try {
			const store = await Store.findById(req.params.id)

			Controller.validateOwnership(req, store)
			if (req.authorized) {
				return res.status(200).json({
					store: store
				})
			}
		} catch (err) {
			return next(err)
		}
	}

	// static async getStore(req, res, next) {}

}

module.exports = StoreController