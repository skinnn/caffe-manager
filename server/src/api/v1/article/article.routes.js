const express = require('express')
const router = express.Router()
const { uploadImage } = require('../../config/multer')
const Auth = require('../../middleware/authentication')

// Controllers
const ArticleController = require('./article.controller')
	
// Get Articles from Subgroup
router.get('/admin/subgroup/:subgroupId/articles',
	ArticleController.getArticlesFromSubgroup)

// Get all Articles
router.get('/admin/articles',
	ArticleController.getAllArticles)

// Delete Article
router.delete('/article/:articleId',
	ArticleController.deleteArticle)

// Create Article
router.post('/admin/article/create',
	uploadImage.single('imageUpload'),
	ArticleController.createArticle)

// Update Article
router.patch('/article/:articleId',
	uploadImage.single('imageUpload'),
	ArticleController.saveArticle)

module.exports = router