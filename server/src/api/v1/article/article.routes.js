const express = require('express')
const router = express.Router()

// Controllers
const ArticleController = require('./article.controller')

// Create article
router.post('/', ArticleController.create)
// Get articles
router.get('/', ArticleController.get)
// Get article by id
router.get('/:id', ArticleController.getById)
// Update article
router.patch('/:id', ArticleController.update)
// Delete article
router.delete('/:id', ArticleController.delete)

// // Get Articles from Subgroup
// router.get('/admin/subgroup/:subgroupId/articles',
// 	ArticleController.getArticlesFromSubgroup)

module.exports = router