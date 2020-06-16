const mongoose = require('mongoose')
const mongooseToJSON = require('./mongooseToJSON')
const fs = require('fs')
const path = require('path')
const Ajv = require('ajv')
const { toBoolean, isEmptyObject, filesFromDir } = require('../lib/helpers')

// Transform _id to id for every mongoose schema
mongoose.plugin(mongooseToJSON)
// Dont pluralize collection names
mongoose.pluralize(null)

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
		Controller.api.schemas = Controller.getEndpointSchemas()
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

	static validateOwnership(req, records) {
		var authorized = false
		if (!Array.isArray(records)) throw new Error('Not an array')
		if (!records.length) return authorized = true
		// if (req.user.roles.includes('root')) return authorized = true
		const schema = Controller.api.schemas[req.resource]

		// If owner in access schema is true, check record ownership
		if (schema.access[req.operation].owner === true) {
			// Update
			if (req.operation === 'update') {
				const userId = req.operation === 'user' ? records[0].id : Controller.getUserId(records[i].user_id)
				if (req.user.id === userId) return authorized = true
			
			// Delete
			} else if (req.operation === 'delete') {
				const userId = req.operation === 'user' ? records[0].id : Controller.getUserId(records[i].user_id)
				if (req.user.id === userId) return authorized = true

			// Read
			} else if (req.operation === 'read') {
				for (let i = 0; i < records.length; i++) {
					const userId = req.operation === 'user' ? records[i].id : Controller.getUserId(records[i].user_id)
					if (req.user.id === userId) return authorized = true
				}
			}

		// If owner in access schema is false, authorize the req
		} else if (schema.access[req.operation].owner === false) {
			return authorized = true

		// Owner field not set in access schema
		} else {
			console.log(`Access owner field not set for operation: ${req.operation}, access schema: `, schema.access)
			authorized = false
		}

		if (authorized) return true
		else {
			authorized = false
			let err = new Error('Invalid permission')
			err.name = 'ForbiddenError'
			console.log(`${req.user.username} is not an owner of: `, )
			throw err
		}
	}

	static getUserId(userIdField) {
		let userId

		if (userIdField && userIdField.id) {
			userId = userIdField.id
		} else {
			userId = userIdField
		}
		return userId
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
	 * Triggered on each incoming request to the application.
	 * @param 	{Object} 		req 		The request object
	 * @param 	{Object} 		res 		The response object
	 * @param 	{function} 	next 		The callback to the next program handler 
	 */
	static async middleware(req, res, next) {
		try {
			res.setHeader('X-Powered-By', 'Caffe Manager')

			await Controller.handleQueryStringsFromRequest(req)
			req.urlParsed = new URL(req.url, [Controller.api.protocol, '://', req.headers.host].join(''))
			// Get resource name from URL - /api/<resource_name>
			req.resource = req.urlParsed.pathname.split('/')[1].toLowerCase()			
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

			var limit = 0, fields = {}, sort = {}, match = {}, include = {}, token = null
			if (req.query.limit) limit = parseInt(req.query.limit)
			if (req.query.fields) fields = req.query.fields
			if (req.query.sort) sort = req.query.sort
			if (req.query.match) match = req.query.match
			if (req.query.include) include = req.query.include
			if (req.query.token) token = req.query.token

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

			// Include
			if (include) {
				if (include === 'user') include = 'user_id'
				if (include === 'file') include = 'files'
			}

			req.queryParsed.limit = limit
			req.queryParsed.fields = fields
			req.queryParsed.sort = sort
			req.queryParsed.match = match
			req.queryParsed.include = include
			req.queryParsed.token = token
			resolve(true)
		})
	}
	
	static getEndpointSchemas() {
		try {
			const apiDir = path.join(__dirname, '../api')
			const jsonSchemas = filesFromDir(apiDir, '.schema.json')
			const parsedSchemas = {}
			for (let i = 0; i < jsonSchemas.length; i++) {
				const schemaParsed = JSON.parse(fs.readFileSync(jsonSchemas[i].path, 'utf8'));
				// Controller.api.schemas[jsonSchemas[i].name] = schemaParsed
				const name = jsonSchemas[i].name.split('.')[0]
				parsedSchemas[name] = schemaParsed
			}
			return parsedSchemas
		} catch (err) {
			throw err
		}
	}
	
	static getCRUDFromMethod(method) {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'read'
      case 'POST':
        return 'create'
      case 'PATCH':
      case 'PUT':
        return 'update'
      case 'DELETE':
        return 'delete'
    }
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