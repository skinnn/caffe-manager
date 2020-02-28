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

// // Get User login list
// router.get('/user/login-list',
// 	UserController.getUserLoginList)

// // Get Admin login list
// router.get('/admin/login-list',
// 	UserController.getAdminLoginList)

module.exports = router