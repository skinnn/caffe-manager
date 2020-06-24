const express = require('express')
const router = express.Router()

// Controllers
const ArticleController = require('./article.controller')

// Create article
router.post('/', ArticleController.createArticle)

router.get('/:id', ArticleController.getArticleById)
router.post('/test', ArticleController.testAdd)

// // Get articles
// router.get('/admin/articles',
// 	ArticleController.getAllArticles)

// // Get Articles from Subgroup
// router.get('/admin/subgroup/:subgroupId/articles',
// 	ArticleController.getArticlesFromSubgroup)

// // Delete Article
// router.delete('/article/:articleId',
// 	ArticleController.deleteArticle)

// // Update Article
// router.patch('/article/:articleId',
// 	uploadImage.single('imageUpload'),
// 	ArticleController.saveArticle)

module.exports = router