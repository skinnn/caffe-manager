const express = require('express')
// Inherith params from the parent router
const router = express.Router({ mergeParams: true })
const { uploadImage } = require('../../../../config/multer')

// Controllers
const AttachmentController = require('./attachment.controller')

/* Endpoints
===================================================== */

// Upload attachment
router.post('/',
	uploadImage.single('attachment'),
	AttachmentController.create)

// Get attachment (by identifier)
router.get('/', AttachmentController.get)

// Get attachment by id
router.get('/:id', AttachmentController.getById)

// Delete attachment by file id
router.delete('/:fileId', AttachmentController.deleteByFileId)

// Update attachment by file id
router.patch('/:fileId',
	uploadImage.single('attachment'),
	AttachmentController.updateByFileId)

// Update attachment for user
router.patch('/',
	uploadImage.single('attachment'),
	AttachmentController.update)

// Delete attachment for user sending the request
router.delete('/', AttachmentController.deleteUserAttachment)

module.exports = router