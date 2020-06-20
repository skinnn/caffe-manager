const express = require('express')
const router = express.Router()
const { uploadImage } = require('../../../config/multer')

const StorageController = require('./storage.controller')
// const ArticleController = require('../article/article.controller')
// const ArticleSubgroupController = require('../category/category.controller')

// Get all Storages
router.get('/',
	StorageController.getAllStorages)

// Create Storage
router.post('/',
	StorageController.createStorage)

// Get Storage by id
router.get('/:id',
StorageController.getStorageById)

// Update Storage
router.patch('/:id',
	StorageController.updateStorage)

// TODO: Move to article routes
// // Get Articles by storage id
// router.get('/:id/articles',
// 	ArticleController.getArticlesByStorageId)

// // Get Article by id
// router.get('/:id/article/:articleId',
// ArticleController.getArticleById)

module.exports = router