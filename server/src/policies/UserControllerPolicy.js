const Joi = require('@hapi/joi')

module.exports = {

  // Admin Policy
  admin(req, res, next) {
    const schema = Joi.object({
			roles: Joi.array().items('admin'),
			username: Joi.string()
				.alphanum()
        .min(5)
        .max(15)
        .required(),
			password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9&@!#$]{6,32}$')),
			password2: Joi.ref('password'),
      name: Joi.string()
        .min(5)
        .max(32)
        .regex(new RegExp('^[a-zA-Z0-9]+([a-zA-Z0-9 ]+)*$'))
        .required(),

      telephone1: Joi.string().allow('').max(20).pattern(new RegExp('^[a-zA-Z0-9+]+([a-zA-Z0-9- ]+)*$')),
      telephone2: Joi.string().allow('').max(20).pattern(new RegExp('^[a-zA-Z0-9+]+([a-zA-Z0-9- ]+)*$')),
      address: Joi.string().allow('').min(0).max(35).pattern(new RegExp('^([a-zA-Z0-9 ]){0,35}$')),
      note: Joi.string().max(250).allow('').pattern(new RegExp('^[a-zA-Z0-9]+([a-zA-Z0-9-@#. ]+)*$')),
      createdBy: Joi.any(),
      profileImage: Joi.any()
		})

    const { error, value } = schema.validate(req.body)

    if (error) {
      switch (error.details[0].context.key) {
        case 'username':
          res.status(400).send({
            username_error: `Username must have more than 5 characters.
              <br>
              It can contain only letters and numbers.`
          })
          break

        case 'password':
          res.status(400).send({
            password_error: `Password must have more than 6 characters.
              <br>
              It can contain only letters and numbers.
              <br>
              It must contain at least one number.`
          })
          break

        case 'password2':
          res.status(400).send({
            password2_error: 'Passwords do not match.'
          })
          break

        case 'name':
          res.status(400).send({
            name_error: `You must provide a name.
            <br>
            It can contain only letters.
            <br>
            It must have more than 5 characters.`
          })
          break

        case 'telephone1':
          res.status(400).send({
            telephone1_error: `Telephone 1 can contain only letters, numbers, dashes and plus signs.`
          })
          break

        case 'telephone2':
          res.status(400).send({
            telephone2_error: `Telephone 2 can contain only letters, numbers, dashes and plus signs.`
          })
          break

        case 'address':
          res.status(400).send({
            address_error: `Address can contain only letters and numbers.`
          })
          break

        case 'note':
          res.status(400).send({
            note_error: `Note can contain only letters, numbers and dots.`
          })
          break

        case 'createdBy':
          res.status(400).send({
            created_by_error: `Created by which admin is not specified.
              <br>
              Please try reloading the application.`
          })
          break

        default:
          console.log(error)
          res.status(400).send({
            error: 'Invalid registration information.'
          })
      }
    } else {
      next()
    }
	},

	// User Policy
  user(req, res, next) {
		console.log('GOT body: ', req.body)
    const schema = Joi.object({
			// more specific but hardcoded roles - Joi.string().valid('admin', 'user')
			roles: Joi.array().items(Joi.string()).min(1).required().min(1),
      username: Joi.string().min(3).max(15).alphanum().required(),
      password: Joi.string().min(4).max(30).required(),
      password2: Joi.string().valid(Joi.ref('password')).required(),
      name: Joi.string().min(3).max(40).regex(/^[a-zA-Z ]*$/).required(),

      phone: Joi.string().allow('').max(20).regex(/^[0-9+ ]*$/),
      address: Joi.string().allow('').max(50).regex(/^[a-zA-Z0-9., ]*$/),
      email: Joi.string().allow('').max(50).email({ minDomainSegments: 2, tlds: { allow: false } }),
      note: Joi.string().max(250).allow(''),
      profileImage: Joi.any()
		})
		.with('password', 'password2');

		const { error, value } = schema.validate(req.body)

    if (error) {
			// console.log('error.details: ', error.details)
			// let errMessages = error.details
			// return res.status(400).send(errMessages)
			switch (error.details[0].context.key) {
				case 'roles':
					console.log('ROLES ERROR:', error.details)
					return res.status(400).send({
						message: `You must specify at least one user role.`,
						error: error
          })
        case 'username':
          return res.status(400).send({
            message: `Username must have more than 3 characters.
              <br>
							It can contain only letters and numbers.`,
							error: error
          })

        case 'password':
          return res.status(400).send({
						message: `Password must have between 4 and 30 characters.`,
						error: error
          })

        case 'password2':
          return res.status(400).send({
						message: 'Passwords do not match.',
						error: error
          })

        case 'name':
          return res.status(400).send({
            message: `Name is required and must have 3 or more characters.
            <br>
						It can contain only letters.`,
						error: error
          })

        case 'phone':
          return res.status(400).send({
						message: `Telephone 1 can contain only letters, numbers, dashes and plus signs.`,
						error: error
          })

        case 'address':
          return res.status(400).send({
						message: `Address can contain only letters and numbers.`,
						error: error
          })
					
				case 'email':
					return res.status(400).send({
						message: `Email must be a valid email address.`,
						error: error
          })

        case 'note':
          return res.status(400).send({
						message: `Note can contain only letters, numbers and dots.`,
						error: error
          })

        case 'createdBy':
          return res.status(400).send({
            message: `Created by which admin is not specified.
              <br>
							Please try reloading the application.`,
						error: error
          })

        default:
          console.log('Validation error:', error)
          return res.status(400).send({
						message: 'Invalid registration information.',
						error: error
          })
      }
    } else {
      next()
    }
	},
	
	// TODO: Finish
	// Update User policy
  updateUser(req, res, next) {
    const schema = Joi.object({
			id: Joi.string(),
			replace: Joi.object(),
			// TODO: Finish
      // username: Joi.string()
      //   .min(5)
      //   .max(15)
      //   .regex(new RegExp('^(?=.*[a-zA-Z]+.*)[a-zA-Z0-9]{5,15}$')),
      // userName: Joi.string()
      //   .min(5)
      //   .max(32)
      //   .regex(new RegExp('^[a-zA-Z0-9]+([a-zA-Z0-9 ]+)*$')),

      // phone: Joi.string().allow('').max(20).regex(new RegExp('^[a-zA-Z0-9+]+([a-zA-Z0-9- ]+)*$')),
      // address: Joi.string().allow('').min(0).max(35).regex(new RegExp('^([a-zA-Z0-9 ]){0,35}$')),
      // note: Joi.string().max(250).allow('').regex(new RegExp('^[a-zA-Z0-9]+([a-zA-Z0-9. ]+)*$')),
      // createdBy: Joi.any(),
      // profileImage: Joi.any()
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      switch (error.details[0].context.key) {
        case 'username':
          res.status(400).send({
            username_error: `Username must have more than 5 characters.
              <br>
              It can contain only letters and numbers.`
          })
          break

        case 'userName':
          res.status(400).send({
            name_error: `You must provide a name.
            <br>
            It can contain only letters.
            <br>
            It must have more than 5 characters.`
          })
          break

        case 'phone':
          res.status(400).send({
            telephone1_error: `Telephone 1 can contain only letters, numbers, dashes and plus signs.`
          })
          break

        case 'userTelephone2':
          res.status(400).send({
            telephone2_error: `Telephone 2 can contain only letters, numbers, dashes and plus signs.`
          })
          break

        case 'userAddress':
          res.status(400).send({
            address_error: `Address can contain only letters and numbers.`
          })
          break

        case 'userMenu':
          res.status(400).send({
            menu_error: `You must provide user with some permissions.`
          })
          break

        case 'userNote':
          res.status(400).send({
            note_error: `Note can contain only letters, numbers and dots.`
          })
          break

        case 'createdBy':
          res.status(400).send({
            created_by_error: `Created by which admin is not specified.
              <br>
              Please try reloading the application.`
          })
          break

        default:
          console.log(error)
          res.status(400).send({
            error: 'Invalid registration information.'
          })
      }
    } else {
      next()
    }
  },

} /* module exports */
