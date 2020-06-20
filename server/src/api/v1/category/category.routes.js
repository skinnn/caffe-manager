const express = require('express')
const router = express.Router()
const { uploadImage } = require('../../config/multer')

// Controllers
const ArticleCategoryController = require('./category.controller')

// Get Article Subgroups from Main Storages
router.get('/admin/main-storages/subgroups',
ArticleCategoryController.getCategoriesFromMainStorages)

// Create Article Subgroup
router.post('/:storageId/subgroup/create',
	uploadImage.single('imageUpload'),
	ArticleCategoryController.createArticleCategory)

// Get Article Subgroup list by storage id
router.get('/:storageId/subgroups',
	ArticleCategoryController.getSubgroupsByStorageId)



module.exports = router