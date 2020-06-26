const mongoose = require('mongoose')
const mongooseToJSON = require('./mongooseToJSON')
// Transform _id to id for every mongoose schema
mongoose.plugin(mongooseToJSON)
// Dont pluralize collection names
mongoose.pluralize(null)

const fs = require('fs')
const path = require('path')
const Ajv = require('ajv')
const { toBoolean, isEmptyObject, filesFromDir } = require('../lib/helpers')

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
			Controller.api.mongoose = mongoose
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

	static responseHandler(req, res, next) {
		if (req.authorized === false) {
			let err = new Error('Forbidden'); err.name = 'ForbiddenError'
			throw err
		}

		const status = res.locals.status || 200
		const jsonData = res.locals.json
		const fileData = res.locals.file

		// JSON response
		if (jsonData) {
			return res.status(status).json(res.locals.json)

		// File response
		} else if (fileData) {
			const fileName = res.locals.file.name
			const directory = Controller.api.uploads.imagesDirectory
			const fullPath = path.join(directory, fileName)
			
			// Check if file exists, if not send empty 204
			fs.access(fullPath, fs.F_OK, (err) => {
				if (err) return res.sendStatus(204)
			})

			return res.status(status).sendFile(fullPath)

		} else {
			return res.sendStatus(status)
		}
	}

	/**
	 * Validate ownership of the record.
	 * @param 	{Object} 					req 			[Request object (with attached: user, resource and CRUD operation)]
	 * @param 	{Array.<Object>} 	records 	[Array of records (objects) to be validated for ownership]
	 * @return 	{Boolean}										[Returns boolean true or false]
	 */
	static validateOwnership(req, records) {
		req.authorized = false
		
		// if (!Array.isArray(records)) throw new TypeError(records, ` is not an array`)
		if (records === null) return req.authorized = true
		if (!records) throw new Error('Records are not defined: ', records)
		if (records && !Array.isArray(records)) records = [records]
		
		if (req.user.roles.includes('root')) return req.authorized = true

		const schema = req.schema
		const ownerFlag = schema.access[req.operation].owner === true

		// If operation is not create and owner in access schema is true, check record ownership
		if (req.operation !== 'create' && ownerFlag) {
			for (let i = 0; i < records.length; i++) {
				// Check if record owner matches user id
				console.log(records[i])
				const ownerId = req.resource === 'user' ? Controller.getOwnerId(records[i].id) : Controller.getOwnerId(records[i].user_id)
				if (req.user.id === ownerId) req.authorized = true
				else {
					req.authorized = false
					break;
				}
			}

		// If owner in access schema is false, authorize the req
		} else if (!ownerFlag) {
			req.authorized = true
		// Owner field not set in access schema
		} else {
			console.log(`Access owner field is not set for:\nResource: ${req.resource}\nOperation: ${req.operation}\nAccess schema:\n`, schema.access)
			throw Controller.makeError('BadRequestError', `File with id ${fileId} does not exist`)
		}

		if (req.authorized === true) return true
		else {
			console.log(`User: ${req.user.username} (${req.user.id}) is not the owner of these record/s:\n`, records)
			return false
		}
	}

	static getOwnerId(userIdField) {
		let ownerId
		// If user_id field is populated with the user record instead of just id (object)
		if (userIdField && userIdField.id) {
			ownerId = userIdField.id.toString('hex')
		}
		else ownerId = userIdField.toString()

		return ownerId
	}

	static validateRequestBody(body) {
		let error = null

		if (body.user_id) error = 'Owner of the record can not be changed'
		if (body.updated_by) error = 'updated_by field can not be changed'
		if (body.created) error = 'created field can not be changed'
		if (body.updated) error = 'updated field can not be changed'
		if (body.files) error = 'files field can not be changed'
		if (body.image_id) error = 'image_id field can not be changed'

		if (error) {
			let err = new Error(error)
			err.name = 'BadRequestError'
			throw err
		}
	}

	static validateToSchema(modelSchema, record) {
		// if (record.user_id) return 'Owner of the record can not be changed.'

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

			// Default local response data scoped to the request 
			res.locals = {
				status: 200,
				json: null,
				file: null
			}

			Controller.handleQueryStringsFromRequest(req)
			Controller.validateRequestBody(req.body)

			req.urlParsed = new URL(req.url, [Controller.api.protocol, '://', req.headers.host].join(''))
			// Get resource name from URL - /api/<resource_name>
			req.resource = req.urlParsed.pathname.split('/')[1].toLowerCase()			
			req.schema = Controller.getSchemaFromRequest(req)
			if (!req.schema) throw Controller.makeError('InternalServerError', `Schema for resource ${req.resource} is not defined`)

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
		req.queryParsed = {}

		var limit = 0, fields = {}, sort = {}, match = {}, include = '', token = null
		if (req.query.limit) limit = parseInt(req.query.limit)
		if (req.query.fields) fields = req.query.fields
		if (req.query.sort) sort = req.query.sort
		if (req.query.match) match = req.query.match
		if (req.query.include) include = req.query.include
		if (req.query.token) token = req.query.token

		// Sort
		for (let field in sort) {
			if (sort[field] === 'asc' || sort[field] == '1' || sort[field] === 1) sort[field] = 1
			else if (sort[field] === 'desc' || sort[field] === '-1' || sort[field] === -1) sort[field] = -1
			else delete sort[field]
		}
			
		// Fields (handle string format - fields=-id,name)
		if (typeof fields === 'string') {
			let items = fields.split(',')

			for (let i = items.length - 1; i >= 0; i--) {
				if (items[i] === '') items.splice(i, 1)
				if (items[i] === 'id') items[i] = '_id'
				if (items[i] === '-id') items[i] = '-_id'
			}

			fields = items.join(' ')

		// Fields (handle format JS object - fields[id]=true)
		} else {
			for (let f in fields) {
				// Transform field to boolean and then to 1/0
				let bool = toBoolean(fields[f])
				fields[f] = bool ? 1 : 0

				// Transform prop 'id' in '_id' (mongodb _id field)
				if (f === 'id') { fields._id = fields.id; delete fields.id }
				// else { fields[f] = toBoolean(fields[f]) }
			}
		}

		// Include
		if (include) {
			let items = include.split(',')

			for (let i = items.length - 1; i >= 0; i--) {
				if (items[i] === '') items.splice(i, 1)
				if (items[i] === 'user') include = 'user_id'
				if (items[i] === 'file') include = 'files'
			}
			include = items.join(' ')
		}

		req.queryParsed.limit = limit
		req.queryParsed.fields = fields
		req.queryParsed.sort = sort
		req.queryParsed.match = match
		req.queryParsed.include = include
		req.queryParsed.token = token
	}
	
	static getEndpointSchemas() {
		try {
			const apiDir = path.join(__dirname, '../api')
			const jsonSchemas = filesFromDir(apiDir, '.schema.json')
			const parsedSchemas = {}
			for (let i = 0; i < jsonSchemas.length; i++) {
				const schemaParsed = JSON.parse(fs.readFileSync(jsonSchemas[i].path, 'utf8'));

				const modelName = jsonSchemas[i].name.split('.')[0]

				// If it is Attachment schema
				if (jsonSchemas[i].name.includes('attachment')) {
					if (!parsedSchemas.attachment) parsedSchemas.attachment = {}
					parsedSchemas.attachment[modelName] = schemaParsed

				// Model schema
				} else {
					parsedSchemas[modelName] = schemaParsed
				}
			}
			return parsedSchemas
		} catch (err) {
			throw err
		}
	}

	static getSchemaFromRequest(req) {
		if (req.urlParsed.pathname.includes('/attachment')) {
			const attachmentSchema = Controller.api.schemas.attachment[req.resource]
			return attachmentSchema
		} else {
			return Controller.api.schemas[req.resource]
		}
	}
	
	static getCRUDFromRequest(req) {
    switch (req.method.toUpperCase()) {
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
		if (err.message == 'Projection cannot have a mix of inclusion and exclusion.') err.message = 'Fields cannot have a mix of inclusion and exclusion.'

		const statusCodeMap = {
			'ForbiddenError': 403,
			'BadRequestError': 400,
			'UnauthorizedError': 401,
			'NotFoundError': 404,
			'MethodError': 405,
			'NotAcceptableError': 406,
			'ConflictError': 409,
			'UnsupportedError': 415,
			'UnprocessableError': 422,
			'InternalServerError': 500
		}
		const statusCode = statusCodeMap[err.name] ? statusCodeMap[err.name] : 400
		let errObj = {}
		err.name ? errObj.name = err.name : null
		err.message ? errObj.message = err.message : null
		err.data ? errObj.data = err.data : null
		// Stack is only returned in development mode
		errObj.stack = process.env.NODE_ENV === 'development' ? err.details || err.stack : null
		
		Controller.logError(err)
		return res.status(statusCode).send(errObj)
	}

	/**
	 * 
	 * @param {String} name 		[Error name]	
	 * @param {String} message 	[Error message]
	 */
	static makeError(name = 'BadRequestError', message = 'Not specified', data) {
		let err = new Error(message)
		err.name = name
		data ? err.data = data : null
		return err
	}

	static modify(obj, newObj) {
		Object.keys(obj).forEach((key) => delete obj[key])
    Object.keys(newObj).forEach((key) => obj[key] = newObj[key])
	}

	static logError(err) {
		console.error(`\n---Error logger---\n`, err)
	}
}

module.exports = Controller