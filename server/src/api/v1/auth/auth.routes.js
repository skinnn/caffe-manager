const express = require('express')
const router = express.Router()
const Authentication = require('../../../lib/Authentication')

const AuthController = require('./auth.controller')

// Login - not using authentication middleware
router.post('/login',
	AuthController.login)

// Authentication
router.use(Authentication.ensureAuthenticated)
	
// Logout
router.delete('/login',
AuthController.logout)

module.exports = router