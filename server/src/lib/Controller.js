const mongoose = require('mongoose')
const mongooseToJSON = require('./mongooseToJSON')
// Transform _id to id for every mongoose schema
mongoose.plugin(mongooseToJSON)
const Ajv = require('ajv')
const { toBoolean, isEmptyObject } = require('../lib/helpers')

// Models
const User = require('../api/v1/user/user.model')

class Controller {
	constructor(api, app) {
		this.api = api
		this.app = app
		this.ajv = {}
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
		Controller.ajv = new Ajv({ allErrors: true, $data: true })
		try {
			await Controller.bootActions()

			return this
		} catch (err) {
			throw err
		}
	}

	static async bootActions() {
		try {
			await this.connectDB()
			await this.insertInitialData()
		} catch (err) {
			throw err
		}
	}

	static async connectDB() {
		try {
			// Connect to a local MongoDB
			await mongoose
				.connect(Controller.api.db.uri, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false, // Fixing deprecation for findOneAndUpdate() query
					autoIndex: false
					// useCreateIndex: true
				})

			Controller.api.db.conn = mongoose.connection.db
			console.log('MongoDB connected')
		} catch (err) {
			throw err
		}
	}

	static async insertInitialData() {
		try {
			// Create root admin if it does not exist
			await Controller.createRootAdmin()
		
		} catch (err) {
			throw err
		}
	}

	// Create root user if it doesn't exist
	static createRootAdmin() {
		return new Promise(async (resolve, reject) => {
			try {
				let query = { roles: 'root' }
				const rootUser = await User.find(query)

				// If Root Admin exists
				if (rootUser.length > 0) {
					console.log('Root user already exists')
					resolve(true)
				} else {
					// If Root User doesn't exist create one
					const defaultRoot = {
						roles: ['root'],
						username: Controller.api.rootUser.username,
						password: Controller.api.rootUser.password
					}
					const root = new User(defaultRoot)

					// Hash the password
					const hash = await User.hashPassword(root.password)
					root.password = hash

					root.created_by = root.id

					root.save()
					console.log('Root user created')
					resolve(true)
				}
			} catch (err) {
				throw err
			}
		})
	}

	static validateToSchema(modelSchema, record) {
		const valid = Controller.ajv.validate(modelSchema, record)
		const errorMessage = Controller.formatSchemaErrors(Controller.ajv.errors)
		if (!valid) {
			return errorMessage
		} else return false
	}

	static formatSchemaErrors(errors) {
		if (errors && errors.length) {
			let errMsg = `Property ${errors[0].dataPath ? errors[0].dataPath+' ' :''}${errors[0].message}`
			if(errors[0].params) {
				if (errors[0].params.additionalProperty) {
					errMsg += ` Property .${errors[0].params.additionalProperty} is not allowed.`
				}
				if(errors[0].params.allowedValues) {
					errMsg += ` Allowed values: ${errors[0].params.allowedValues.join(', ')}.`
				}
				if (errors[0].params.allowedValue) {
					if (errors[0].dataPath = '.password2') errMsg += ` .password`
					else errMsg += ` .${errors[0].params.allowedValue}`
				}
			}
			return errMsg
		}
	}

	/**
	 * Application-level middleware.
	 * Called before each endpoint which requires user authentication.
	 * @param 	{Object} 		req 		The request object
	 * @param 	{Object} 		res 		The response object
	 * @param 	{function} 	next 		The callback to the next program handler 
	 */
	static async middleware(req, res, next) {
		try {
			await Controller.handleQueryStringsFromRequest(req)
			return next()
		} catch (err) {
			return next(err)
		}
	}

	/**
	 * Parses default query parameters: limit, fields, sort, match, include.
	 * Parsed query params are attached to the request object - req.queryParsed.
	 *	
	 * limit: number, fields: Object, sort: Object, match: Object, include: Object 
	 * @param 	{Object} 	req 	[The request object]
	 */
	static handleQueryStringsFromRequest(req) {
		return new Promise((resolve, reject) => {
			req.queryParsed = {}
			if (isEmptyObject(req.query)) resolve(true)

			var limit = 0, fields = {}, sort = {}, match = {}, include = {}
			if (req.query.limit) limit = parseInt(req.query.limit)
			if (req.query.fields) fields = req.query.fields
			if (req.query.sort) sort = req.query.sort
				// TODO: Add support for query strings - [include]
			if (req.query.match) match = req.query.match
			// if (req.query.include) include = req.query.include

			// Sort
			for (let field in sort) {
				if (sort.hasOwnProperty(field)) {
					if (sort[field] === 'asc' || sort[field] == '1') sort[field] = 1
					else if (sort[field] === 'desc' || sort[field] === '-1') sort[field] = -1
					else delete sort[field]
				}
			}
				
			// Fields (handle format JSON object - fields={"id":true})
			if (typeof fields === 'string') {
				try {
					fields = JSON.parse(fields)
					// Transform prop 'id' in '_id' (mongodb supported field)
					if (fields.id !== undefined) fields._id = fields.id; delete fields.id;
				} catch (err) {}

			// Fields (handle format JS object - fields[id]=true)
			} else {
				for (let f in fields) {
					if (fields.hasOwnProperty(f)) {
						// Transform prop 'id' in '_id' (mongodb supported field)
						if (f === 'id') { fields.id = toBoolean(fields[f]); delete fields.id; }
						else { fields[f] = toBoolean(fields[f]) }
					}
				}
			}

			req.queryParsed.limit = limit
			req.queryParsed.fields = fields
			req.queryParsed.sort = sort
			req.queryParsed.match = match
			req.queryParsed.include = include
			resolve(true)
		})
	}

	static errorHandler(err, req, res, next) {
		if (res.headersSent) return null
		// Handle custom errors/responses here

		const statusCodeMap = {
			'ForbiddenError': 403,
			'BadRequestError': 400,
			'UnauthorizedError': 401,
			'NotFoundError': 404,
			'MethodError': 405,
			'NotAcceptableError': 406,
			'ConflictError': 409,
			'UnsupportedError': 415,
			'UnprocessableError': 422
		}
		const statusCode = statusCodeMap[err.name] ? statusCodeMap[err.name] : 400
		let errObj = {}
		err.name ? errObj.name = err.name : null
		err.message ? errObj.message = err.message : null
		// Stack is only returned in development mode
		errObj.stack = process.env.NODE_ENV === 'development' ? err.details || err.stack : null
		
		Controller.logError(err)
		return res.status(statusCode).send(errObj)
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