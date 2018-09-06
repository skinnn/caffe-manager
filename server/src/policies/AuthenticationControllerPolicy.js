const Joi = require('joi')

// TODO: Separate files with policies for articles, storages, etc.

module.exports = {
  // User Policy
  registerUser(req, res, next) {
    const schema = {
      // TODO: Username must have between 3 and 15 characters
      userUsername: Joi.string().required(),
      userName: Joi.string().required(),
      userPassword: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{6,32}$')
      ).required(),
      userPassword2: Joi.any().valid(Joi.ref('userPassword')).options({ language: { any: { allowOnly: 'must match password' } } }).label('Password Confirmation'),
      userMenu: Joi.any(),
      createdBy: Joi.any(),
      imageUpload: Joi.any()
    }

    const { error, value } = Joi.validate(req.body, schema)

    if (error) {
      switch (error.details[0].context.key) {
        case 'userUsername':
          res.status(400).send({
            error: 'You must provide a valid username.'
          })
          break

        case 'userName':
          res.status(400).send({
            error: 'You must provide a name.'
          })
          break

        case 'userPassword':
          res.status(400).send({
            error: `Password must be between 6 and 32 characters.
              <br>
              It can contain ONLY letters and numbers.`
          })
          break

        case 'userPassword2':
          res.status(400).send({
            error: 'Passwords do not match.'
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
      // TODO: Username must have between 3 and 15 characters
      adminUsername: Joi.string().required(),
      adminName: Joi.string().required(),
      adminPassword: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{6,32}$')
      ).required(),
      adminPassword2: Joi.any().valid(Joi.ref('adminPassword'))
        .options({ language: { any: { allowOnly: 'must match password' } } })
        .label('Password Confirmation'),
      createdBy: Joi.any(),
      imageUpload: Joi.any()
    }

    const { error, value } = Joi.validate(req.body, schema)

    if (error) {
      switch (error.details[0].context.key) {
        case 'adminUsername':
          res.status(400).send({
            error: 'You must provide a valid username. It must contain between 3 and 15 characters.'
          })
          break

        case 'adminName':
          res.status(400).send({
            error: 'You must provide a name.'
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
