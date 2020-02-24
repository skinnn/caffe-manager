const jwt = require('jsonwebtoken')
const config = require('../config/config.js')

const secret = config.authentication.jwtSecret

const checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'] // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length)
  }

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Token is not valid'
        })
      } else {
				console.log('Token is valid!')
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.status(401).json({
      success: false,
      message: 'Auth token is not supplied'
    })
  }
}

module.exports = {
  checkToken: checkToken
}