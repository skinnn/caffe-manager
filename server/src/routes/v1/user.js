const express = require('express')
const router = express.Router()
const { uploadImage } = require('../../config/multer')

// Controllers
const UserController = require('../../controllers/user.controller')

// Policies
const UserControllerPolicy = require('../../policies/UserControllerPolicy')

// Middleware
const auth = require('../../middleware/authentication')

// Authentication
router.use(auth.ensureAuthenticated)

// Development middleware
if (process.env.NODE_ENV === 'development') {
	router.use((req, res, next) => {
		// TODO: Fix
		// console.log('routes/protected/user.js, user: ', req.user)
		// console.log('routes/protected/user.js, admin: ', req.user)
		next()
	})
}

/* Base: /user
===================================================== */

// TODO: First validation and then image upload
// Upload user attachment
router.post('/:id/attachment',
	uploadImage.single('attachment'),
	UserController.createAttachment)

// Create user
router.post('/',
	UserControllerPolicy.user,
	UserController.createUser)

// Get all users
router.get('/',
	UserController.getAllUsers)

// Get user by id
router.get('/:id',
	UserController.getUserById)

// Update user by id
router.patch('/:id',
	uploadImage.single('profileImage'),
	// UserControllerPolicy.updateUser,
	UserController.updateUserById)

// Delete User by id
router.delete('/:id',
	UserController.deleteUserById)

module.exports = router