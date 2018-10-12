const Joi = require('joi')

// TODO: Separate files with policies for articles, storages, etc.

module.exports = {
  // User Policy
  registerUser(req, res, next) {
    const schema = {
      // TODO: Username must have between 5 and 20 characters
      userUsername: Joi.string().min(5).max(15).regex(new RegExp('^(?=.*[a-zA-Z]+.*)[a-zA-Z0-9]{5,15}$')).required(),
      userPassword: Joi.string()
        .regex(new RegExp('^(?=.*[0-9]+.*)[a-zA-Z0-9]{6,32}$'))
        .required(),
      userPassword2: Joi.any()
        .valid(Joi.ref('userPassword'))
        .options({ language: { any: { allowOnly: 'must match password' } } })
        .label('Password Confirmation'),
      userName: Joi.string().min(5).max(32).regex(new RegExp('^[a-zA-Z0-9]+([a-zA-Z0-9 ]+)*$')).required(),

      userTelephone1: Joi.string().allow('').max(20).regex(new RegExp('^[a-zA-Z0-9+]+([a-zA-Z0-9- ]+)*$')),
      userTelephone2: Joi.string().allow('').max(20).regex(new RegExp('^[a-zA-Z0-9+]+([a-zA-Z0-9- ]+)*$')),
      userAddress: Joi.string().allow('').min(0).max(35).regex(new RegExp('^([a-zA-Z0-9 ]){0,35}$')),
      userNote: Joi.string().max(250).allow('').regex(new RegExp('^[a-zA-Z0-9]+([a-zA-Z0-9. ]+)*$')),
      userMenu: Joi.any(),
      createdBy: Joi.any(),
      imageUpload: Joi.any()
    }

    const { error, value } = Joi.validate(req.body, schema)

    if (error) {
      switch (error.details[0].context.key) {
        case 'userUsername':
          res.status(400).send({
            error: `Username must have more than 5 characters.
              <br>
              It can contain ONLY letters and numbers.`
          })
          break

        case 'userPassword':
          res.status(400).send({
            error: `Password must have more than 6 characters.
              <br>
              It can contain ONLY letters and numbers.
              <br>
              It MUST contain at least one number.`
          })
          break

        case 'userPassword2':
          res.status(400).send({
            error: 'Passwords do not match.'
          })
          break

        case 'userName':
          res.status(400).send({
            error: `You must provide a name.
            <br>
            It can contain ONLY letters.
            <br>
            It MUST have more than 5 characters.`
          })
          break

        case 'userTelephone1':
          res.status(400).send({
            error: `Telephone 1 can contain ONLY letters, numbers, dashes/hyphens and plus signs.`
          })
          break

        case 'userTelephone2':
          res.status(400).send({
            error: `Telephone 1 can contain ONLY letters, numbers, dashes/hyphens and plus signs.`
          })
          break

        case 'userAddress':
          res.status(400).send({
            error: `Address can contain ONLY letters and numbers.`
          })
          break

        case 'userMenu':
          res.status(400).send({
            error: `You must provide user with some permissions.`
          })
          break

        case 'userNote':
          res.status(400).send({
            error: `Note can contain ONLY letters, numbers and dots.`
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
  },

  // Admin Policy
  registerAdmin(req, res, next) {
    const schema = {
      adminUsername: Joi.string().min(5).max(15).regex(new RegExp('^(?=.*[a-zA-Z]+.*)[a-zA-Z0-9]{5,15}$')).required(),
      adminPassword: Joi.string()
        .regex(new RegExp('^(?=.*[0-9]+.*)[a-zA-Z0-9]{6,32}$'))
        .required(),
      adminPassword2: Joi.any()
        .valid(Joi.ref('adminPassword'))
        .options({ language: { any: { allowOnly: 'must match password' } } })
        .label('Password Confirmation'),
      adminName: Joi.string().min(5).max(32).regex(new RegExp('^[a-zA-Z0-9]+([a-zA-Z0-9 ]+)*$')).required(),

      telephone1: Joi.string().allow('').max(20).regex(new RegExp('^[a-zA-Z0-9+]+([a-zA-Z0-9- ]+)*$')),
      telephone2: Joi.string().allow('').max(20).regex(new RegExp('^[a-zA-Z0-9+]+([a-zA-Z0-9- ]+)*$')),
      address: Joi.string().allow('').min(0).max(35).regex(new RegExp('^([a-zA-Z0-9 ]){0,35}$')),
      note: Joi.string().max(250).allow('').regex(new RegExp('^[a-zA-Z0-9]+([a-zA-Z0-9. ]+)*$')),
      createdBy: Joi.any(),
      imageUpload: Joi.any()
    }

    const { error, value } = Joi.validate(req.body, schema)

    if (error) {
      switch (error.details[0].context.key) {
        case 'adminUsername':
          res.status(400).send({
            error: `Username must have more than 5 characters.
              <br>
              It can contain ONLY letters and numbers.`
          })
          break

        case 'adminPassword':
          res.status(400).send({
            error: `Password must have more than 6 characters.
              <br>
              It can contain ONLY letters and numbers.
              <br>
              It MUST contain at least one number.`
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
            It can contain ONLY letters.
            <br>
            It MUST have more than 5 characters.`
          })
          break

        case 'telephone1':
          res.status(400).send({
            error: `Telephone 1 can contain ONLY letters, numbers, dashes/hyphens and plus signs.`
          })
          break

        case 'telephone2':
          res.status(400).send({
            error: `Telephone 1 can contain ONLY letters, numbers, dashes/hyphens and plus signs.`
          })
          break

        case 'address':
          res.status(400).send({
            error: `Address can contain ONLY letters and numbers.`
          })
          break

        case 'note':
          res.status(400).send({
            error: `Note can contain ONLY letters, numbers and dots.`
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
