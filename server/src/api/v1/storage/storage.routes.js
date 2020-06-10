const express = require('express')
const router = express.Router()
const { uploadImage } = require('../../../config/multer')

const StorageController = require('./storage.controller')
const ArticleController = require('../article/article.controller')
const ArticleSubgroupController = require('../category/category.controller')

// TODO: Refactor routes

// Get all Storages
router.get('/',
	StorageController.getAllStorages)

// Create Storage
router.post('/',
	StorageController.createStorage)

// Get Storage by id
router.get('/:storageId',
StorageController.getStorageById)

// Update Storage
router.patch('/:storageId',
	StorageController.saveStorage)

// Get Articles by storage id
router.get('/:storageId/articles',
	ArticleController.getArticlesByStorageId)

// Get Article by id
router.get('/:storageId/article/:articleId',
ArticleController.getArticleById)

module.exports = router