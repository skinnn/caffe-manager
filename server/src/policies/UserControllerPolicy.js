const Joi = require('@hapi/joi')

module.exports = {

  // Admin Policy
  admin(req, res, next) {
    const schema = Joi.object({
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
      imageUpload: Joi.any()
		})

    const { error, value } = schema.validate(req.body)

    if (error) {
      switch (error.details[0].context.key) {
        case 'username':
          res.status(400).send({
            username_error: `Username must have more than 5 characters.
              <br>
              It can contain ONLY letters and numbers.`
          })
          break

        case 'password':
          res.status(400).send({
            password_error: `Password must have more than 6 characters.
              <br>
              It can contain ONLY letters and numbers.
              <br>
              It MUST contain at least one number.`
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
            It can contain ONLY letters.
            <br>
            It MUST have more than 5 characters.`
          })
          break

        case 'telephone1':
          res.status(400).send({
            telephone1_error: `Telephone 1 can contain ONLY letters, numbers, dashes and plus signs.`
          })
          break

        case 'telephone2':
          res.status(400).send({
            telephone2_error: `Telephone 2 can contain ONLY letters, numbers, dashes and plus signs.`
          })
          break

        case 'address':
          res.status(400).send({
            address_error: `Address can contain ONLY letters and numbers.`
          })
          break

        case 'note':
          res.status(400).send({
            note_error: `Note can contain ONLY letters, numbers and dots.`
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
    const schema = Joi.object({
      username: Joi.string()
        .min(5)
        .max(15)
        .regex(new RegExp('^(?=.*[a-zA-Z]+.*)[a-zA-Z0-9]{5,15}$'))
        .required(),
      password: Joi.string()
        .regex(new RegExp('^(?=.*[0-9]+.*)[a-zA-Z0-9]{6,32}$'))
        .required(),
      password2: Joi.any()
        .valid(Joi.ref('password')),
      name: Joi.string()
        .min(5)
        .max(32)
        .regex(new RegExp('^[a-zA-Z0-9]+([a-zA-Z0-9 ]+)*$'))
        .required(),

      phone: Joi.string().allow('').max(20).regex(new RegExp('^[a-zA-Z0-9+]+([a-zA-Z0-9- ]+)*$')),
      address: Joi.string().allow('').min(0).max(35).regex(new RegExp('^([a-zA-Z0-9 ]){0,35}$')),
      email: Joi.string().allow('').min(0).max(35).regex(new RegExp('^([a-zA-Z0-9]){0,35}$')),
      note: Joi.string().max(250).allow('').regex(new RegExp('^[a-zA-Z0-9]+([a-zA-Z0-9. ]+)*$')),
      createdBy: Joi.any(),
      profileImage: Joi.any(),
      roles: Joi.array().items(Joi.string())
    })

		const { error, value } = schema.validate(req.body)

    if (error) {
      switch (error.details[0].context.key) {
        case 'username':
          console.log(error)
          res.status(400).send({
            username_error: `Username must have more than 5 characters.
              <br>
              It can contain ONLY letters and numbers.`
          })
          break

        case 'password':
          res.status(400).send({
            password_error: `Password must have more than 6 characters.
              <br>
              It can contain ONLY letters and numbers.
              <br>
              It MUST contain at least one number.`
          })
          break

        case 'password2':
          res.status(400).send({
            password2_error: 'Passwords do not match.'
          })
          break

        case 'userName':
          res.status(400).send({
            name_error: `You must provide a name.
            <br>
            It can contain ONLY letters.
            <br>
            It MUST have more than 5 characters.`
          })
          break

        case 'phone':
          res.status(400).send({
            telephone1_error: `Telephone 1 can contain ONLY letters, numbers, dashes and plus signs.`
          })
          break

        case 'userTelephone2':
          res.status(400).send({
            telephone2_error: `Telephone 2 can contain ONLY letters, numbers, dashes and plus signs.`
          })
          break

        case 'userAddress':
          res.status(400).send({
            address_error: `Address can contain ONLY letters and numbers.`
          })
          break

        case 'userMenu':
          res.status(400).send({
            menu_error: `You must provide user with some permissions.`
          })
          break

        case 'userNote':
          res.status(400).send({
            note_error: `Note can contain ONLY letters, numbers and dots.`
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
	
	// TODO: Finish
	// Update User policy
  updateUser(req, res, next) {
    const schema = Joi.object({
			id: Joi.string(),
			replace: Joi.object(),
      // username: Joi.string()
      //   .min(5)
      //   .max(15)
      //   .regex(new RegExp('^(?=.*[a-zA-Z]+.*)[a-zA-Z0-9]{5,15}$')),
      // userName: Joi.string()
      //   .min(5)
      //   .max(32)
      //   .regex(new RegExp('^[a-zA-Z0-9]+([a-zA-Z0-9 ]+)*$')),

      // phone: Joi.string().allow('').max(20).regex(new RegExp('^[a-zA-Z0-9+]+([a-zA-Z0-9- ]+)*$')),
      // userTelephone2: Joi.string().allow('').max(20).regex(new RegExp('^[a-zA-Z0-9+]+([a-zA-Z0-9- ]+)*$')),
      // userAddress: Joi.string().allow('').min(0).max(35).regex(new RegExp('^([a-zA-Z0-9 ]){0,35}$')),
      // userNote: Joi.string().max(250).allow('').regex(new RegExp('^[a-zA-Z0-9]+([a-zA-Z0-9. ]+)*$')),
      // userMenu: Joi.any(),
      // createdBy: Joi.any(),
      // imageUpload: Joi.any()
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      switch (error.details[0].context.key) {
        case 'username':
          res.status(400).send({
            username_error: `Username must have more than 5 characters.
              <br>
              It can contain ONLY letters and numbers.`
          })
          break

        case 'userName':
          res.status(400).send({
            name_error: `You must provide a name.
            <br>
            It can contain ONLY letters.
            <br>
            It MUST have more than 5 characters.`
          })
          break

        case 'phone':
          res.status(400).send({
            telephone1_error: `Telephone 1 can contain ONLY letters, numbers, dashes and plus signs.`
          })
          break

        case 'userTelephone2':
          res.status(400).send({
            telephone2_error: `Telephone 2 can contain ONLY letters, numbers, dashes and plus signs.`
          })
          break

        case 'userAddress':
          res.status(400).send({
            address_error: `Address can contain ONLY letters and numbers.`
          })
          break

        case 'userMenu':
          res.status(400).send({
            menu_error: `You must provide user with some permissions.`
          })
          break

        case 'userNote':
          res.status(400).send({
            note_error: `Note can contain ONLY letters, numbers and dots.`
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
