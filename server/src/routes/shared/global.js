const express = require('express')
const router = express.Router()
// Controllers
const AuthenticationController = require('../../controllers/AuthenticationController')
const UserController = require('../../controllers/UserController')

// Login
router.post('/login',
	AuthenticationController.login)
	
// Logout
router.post('/logout',
	AuthenticationController.logout)

// Get Login list of users/admins
router.get('/login-list/:role',
	UserController.getLoginList)

module.exports = router