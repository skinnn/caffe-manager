const express = require('express')
const router = express.Router()
const { uploadImage } = require('../../../config/multer')

// Controllers
const FileController = require('./file.controller')

// Policies
// const FileControllerPolicy = require('../../policies/FileControllerPolicy')

/* Base: /file
===================================================== */

// TODO: First validation and then file upload
// Create user
router.post('/', // types: [image]
	// TODO: File metadata fields validation with Joi
	// FileControllerPolicy.createImage,
	uploadImage.single('file'),
	FileController.createFile)

// router.get('/')

module.exports = router