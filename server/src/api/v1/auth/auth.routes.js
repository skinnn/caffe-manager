const express = require('express')
const router = express.Router()
const Authentication = require('../../../lib/Authentication')

const Controller = require('../../../lib/Controller')
const AuthController = require('./auth.controller')

// Login - not using authentication middleware
router.post('/login',
	AuthController.login)
	
// Logout
router.delete('/login',
AuthController.logout)

module.exports = router