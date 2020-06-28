const express = require('express')
const router = express.Router()
// const { uploadImage } = require('../../../config/multer')

// Controllers
const CategoryController = require('./category.controller')

// TODO: Create attachment for category 'category_image'

// Create category
router.post('/', CategoryController.createCategory)

// Get categories
router.get('/', CategoryController.getCategories)

// Get category by id
router.get('/:id', CategoryController.getCategoryById)

// Update category by id
router.patch('/:id', CategoryController.updateCategoryById)

// Delete category by id
router.delete('/:id', CategoryController.deleteCategoryById)

// Get category
// router.get('/:storageId/subgroups',
// 	CategoryController.getSubgroupsByStorageId)

// // Get Article Subgroups from Main Storages
// router.get('/admin/main-storages/subgroups',
// CategoryController.getCategoriesFromMainStorages)

module.exports = router