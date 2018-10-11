const Joi = require('joi')

// TODO: Separate files with policies for articles, storages, etc.

module.exports = {
  // User Policy
  registerUser(req, res, next) {
    const pwStart = new RegExp('[a-zA-Z0-9]')
    const pwEnd = new RegExp('[a-zA-Z0-9 ]*$')
    const pwLength = new RegExp('(?=.{6,32})')
    const pwNumberAndLowercase = new RegExp('(?=.*[a-z])(?=.*[0-9])')
    const schema = {
      // TODO: Username must have between 5 and 20 characters
      userUsername: Joi.string().regex(new RegExp('[a-zA-Z0-9]{5,20}$')).required(),
      userPassword: Joi.string().regex(new RegExp('[a-zA-Z0-9](?=.{6,32})(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9 ]*$')).required(),
      userPassword2: Joi.any()
        .valid(Joi.ref('userPassword'))
        .options({ language: { any: { allowOnly: 'must match password' } } })
        .label('Password Confirmation'),
      userName: Joi.string().regex(new RegExp('[a-zA-Z0-9](?=.{5,32})(?=.*[a-z])[a-zA-Z0-9 ]*$')).required(),

      userTelephone1: Joi.string().allow('').regex(new RegExp('[a-zA-Z0-9+_]+( [a-zA-Z0-9_]+)*$')),
      userTelephone2: Joi.string().allow('').regex(new RegExp('[a-zA-Z0-9+_]+( [a-zA-Z0-9_]+)*$')),
      userAddress: Joi.string().allow('').regex(new RegExp('[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$')),
      userNote: Joi.string().max(250).allow('').regex(new RegExp('[a-zA-Z0-9_.]+( [a-zA-Z0-9_.]+)*$')),
      userMenu: Joi.any(),
      createdBy: Joi.any(),
      imageUpload: Joi.any()
    }

    const { error, value } = Joi.validate(req.body, schema)

    if (error) {
      switch (error.details[0].context.key) {
        case 'userUsername':
          res.status(400).send({
            error: `Username must have between 5 and 20 characters.
              <br>
              It must be ONE WORD and can contain ONLY letters and numbers.`
          })
          break

        case 'userPassword':
          res.status(400).send({
            error: `Password must have more than 6 and less 32 characters.
              <br>
              It can contain only letters, numbers and spaces.
              <br>
              It must contain AT LEAST one lowercase letter AND one number.`
          })
          break

        case 'userPassword2':
          res.status(400).send({
            error: 'Passwords do not match.'
          })
          break

        case 'userName':
          res.status(400).send({
            error: 'Name must have more than 5 and less than 32 characters.'
          })
          break

        case 'telephone1':
          res.status(400).send({
            error: `Telephone 1 can contain ONLY letters, numbers and plus sign.`
          })
          break

        case 'telephone2':
          res.status(400).send({
            error: `Telephone 2 can contain ONLY letters, numbers and plus sign.`
          })
          break

        case 'address':
          res.status(400).send({
            error: `Address can contain ONLY letters and numbers.`
          })
          break

        case 'note':
          res.status(400).send({
            error: `Note can contain ONLY letters, numbers and dots.
            <br>
            Maximum is 250 characters.`
          })
          break

        case 'userMenu':
          res.status(400).send({
            error: `You must provide user with some permissions.`
          })
          break

        case 'createdBy':
          res.status(400).send({
            error: 'Created by which admin must be specified.'
          })
          break

        default:
          res.status(400).send({
            error: 'Invalid registration information.'
          })
      }
    } else {
      next()
    }
  },

  // Admin Policy
  registerAdmin(req, res, next) {
    const schema = {
      adminUsername: Joi.string().regex(new RegExp('^[a-zA-Z0-9]{5,15}$')).required(),
      adminPassword: Joi.string()
        .regex(new RegExp('^[a-zA-Z0-9]{6,32}$'))
        .required(),
      adminPassword2: Joi.any()
        .valid(Joi.ref('adminPassword'))
        .options({ language: { any: { allowOnly: 'must match password' } } })
        .label('Password Confirmation'),
      adminName: Joi.string().regex(new RegExp('^[a-zA-Z_]+( [a-zA-Z_]+)*$')).required(),

      telephone1: Joi.string().allow('').regex(new RegExp('^[a-zA-Z0-9+_]+( [a-zA-Z0-9_]+)*$')),
      telephone2: Joi.string().allow('').regex(new RegExp('^[a-zA-Z0-9+_]+( [a-zA-Z0-9_]+)*$')),
      address: Joi.string().allow('').regex(new RegExp('^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$')),
      note: Joi.string().max(250).allow('').regex(new RegExp('^[a-zA-Z0-9_.]+( [a-zA-Z0-9_.]+)*$')),
      createdBy: Joi.any(),
      imageUpload: Joi.any()
    }

    const { error, value } = Joi.validate(req.body, schema)

    if (error) {
      switch (error.details[0].context.key) {
        case 'adminUsername':
          res.status(400).send({
            error: `Username must contain between 5 and 15 characters.
            <br>
            It can contain ONLY letters and numbers.`
          })
          break

        case 'adminPassword':
          res.status(400).send({
            error: `Password must be between 6 and 32 characters.
              <br>
              It can contain ONLY letters and numbers.`
          })
          break

        case 'adminPassword2':
          res.status(400).send({
            error: 'Passwords do not match.'
          })
          break

        case 'adminName':
          res.status(400).send({
            error: `You must provide a name.
            <br>
            It can contain ONLY letters.`
          })
          break

        case 'telephone1':
          res.status(400).send({
            error: `Telephone 1 can contain ONLY letters, numbers and plus sign.`
          })
          break

        case 'telephone2':
          res.status(400).send({
            error: `Telephone 2 can contain ONLY letters, numbers and plus sign.`
          })
          break

        case 'address':
          res.status(400).send({
            error: `Address can contain ONLY letters and numbers.`
          })
          break

        case 'note':
          res.status(400).send({
            error: `Note can contain ONLY letters, numbers and dots.
            <br>
            Maximum is 250 characters.`
          })
          break

        case 'createdBy':
          res.status(400).send({
            error: 'Created by which admin must be specified.'
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
  }
}
