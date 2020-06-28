const express = require('express')
const router = express.Router()
// Controllers
const ArticleController = require('./article.controller')

// Attachment endpoints
const attachmentRoutes = require('./attachment/article.attachment.routes')
router.use('/attachment', attachmentRoutes)
router.use('/:id/attachment', attachmentRoutes)

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

module.exports = router