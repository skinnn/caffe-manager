const express = require('express')
const router = express.Router()
const { uploadImage } = require('../../../config/multer')

// Controllers
const UserController = require('./user.controller')
const FileController = require('../file/file.controller')

/* Base: /user
===================================================== */

// Upload user attachment
router.post('/:id/attachment',
	uploadImage.single('attachment'),
	UserController.createAttachment)
// Get user attachment by query param identifier
router.get('/:id/attachment',
	UserController.getAttachment)
// Get user attachment by id
router.get('/attachment/:id',
	UserController.getAttachmentById)

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

// Delete User by id
router.delete('/:id',
	UserController.deleteUserById)

module.exports = router