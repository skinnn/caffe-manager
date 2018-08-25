const Joi = require('joi')

// TODO: Separate files with policies for articles, storages, etc.

module.exports = {
  // User Policy
  registerUser(req, res, next) {
    const schema = {
      // TODO: Username must have between 3 and 15 characters
      username: Joi.string().required(),
      name: Joi.string().required(),
      password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{6,32}$')
      ).required(),
      password2: Joi.any().valid(Joi.ref('password')).options({ language: { any: { allowOnly: 'must match password' } } }).label('Password Confirmation'),
      userMenu: Joi.object().keys({
        home: Joi.boolean().required(),
        warehouse: Joi.boolean().required(),
        tables: Joi.boolean().required()
      })
    }

    const { error, value } = Joi.validate(req.body, schema)

    if (error) {
      switch (error.details[0].context.key) {
        case 'username':
          res.status(400).send({
            error: 'You must provide a valid username.'
          })
          break

        case 'name':
          res.status(400).send({
            error: 'You must provide a name.'
          })
          break

        case 'password':
          res.status(400).send({
            error: `Password must be between 6 and 32 characters.
              <br>
              It can contain ONLY letters and numbers.`
          })
          break

        case 'password2':
          res.status(400).send({
            error: 'Passwords do not match.'
          })
          break

        case 'userMenu':
          res.status(400).send({
            error: `You must provide user with some permissions.`
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
      username: Joi.string().required(),
      name: Joi.string().required(),
      password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{6,32}$')
      ).required(),
      password2: Joi.any().valid(Joi.ref('password'))
        .options({ language: { any: { allowOnly: 'must match password' } } })
        .label('Password Confirmation')
    }

    const { error, value } = Joi.validate(req.body, schema)

    if (error) {
      switch (error.details[0].context.key) {
        case 'username':
          res.status(400).send({
            error: 'You must provide a valid username. It must contain between 3 and 15 characters.'
          })
          break

        case 'name':
          res.status(400).send({
            error: 'You must provide a name.'
          })
          break

        case 'password':
          res.status(400).send({
            error: `Password must be between 6 and 32 characters.
              <br>
              It can contain ONLY letters and numbers.`
          })
          break

        case 'password2':
          res.status(400).send({
            error: 'Passwords do not match.'
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
  }
}
