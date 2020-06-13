const express = require('express')
const router = express.Router()

// Controllers
const FileController = require('./file.controller')

// Policies
// const FileControllerPolicy = require('../../policies/FileControllerPolicy')

/* Base: /file
===================================================== */

// TODO: Get file meta by id
// router.get('/:id',
// 	FileController.getFileMetaById)

// TODO: Get file meta
// GET /files/:id
// GET /files?identifier=profile_image

module.exports = router