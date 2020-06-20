const Joi = require('@hapi/joi')

module.exports = {

	// Create user policy
	create(body) {
		const schema = Joi.object({
			roles: Joi.array().items(Joi.string()).min(1).required(),
			username: Joi.string().min(3).max(15).alphanum().required(),
			password: Joi.string().min(4).max(30).disallow(Joi.ref('username')).required(),
			password2: Joi.string().valid(Joi.ref('password')).required(),
			name: Joi.string().min(3).max(40).regex(/^[a-zA-Z ]*$/).required(),

			phone: Joi.string().allow('').max(20).regex(/^[0-9+ ]*$/),
			address: Joi.string().allow('').max(50).regex(/^[a-zA-Z0-9., ]*$/),
			email: Joi.string().allow('').max(50).email({ minDomainSegments: 2, tlds: { allow: false } }),
			note: Joi.string().max(250).allow(''),
			profileImage: Joi.any()
		})
			.with('password', 'password2')

		const validated = schema.validate(body)
		return validated
	},
	
	// Update User policy
	// updateUser(req, res, next) {
	// 	const schema = Joi.object({
	// 		id: Joi.string(),
	// 		replace: Joi.object()
	// 	})

	// 	const { error, value } = schema.validate(req.body)
	// }

} /* module exports */