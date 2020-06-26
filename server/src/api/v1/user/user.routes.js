const express = require('express')
const router = express.Router()
const { uploadImage } = require('../../../config/multer')

// Controllers
const UserController = require('./user.controller')

/* Base: /user
===================================================== */

// Attachment endpoints
const attachmentRoutes = require('./attachment/attachment.routes')
router.use('/attachment', attachmentRoutes)
router.use('/:id/attachment', attachmentRoutes)

// Create user
router.post('/',
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
	UserController.updateUserById)

// Delete user by id
router.delete('/:id',
	UserController.deleteUserById)

module.exports = router