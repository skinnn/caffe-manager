const express = require('express')
const router = express.Router()
const { uploadImage } = require('../../config/multer')
const Auth = require('../../middleware/authentication')

// Controllers
const AuthenticationController = require('../../controllers/login.controller')
const SettingsController = require('../../controllers/setting.controller')
const ArticleController = require('../../controllers/article.controller')
const ArticleSubgroupController = require('../../controllers/category.controller')
const TablesController = require('../../controllers/tables.controller')
const OrderController = require('../../controllers/order.controller')
const UserController = require('../../controllers/user.controller')

// Login - not using authentication
router.post('/login',
	AuthenticationController.login)

// Get Login list of users/admins - not using authentication
router.get('/user/login-list',
	UserController.getLoginList)

// Authentication
router.use(Auth.ensureAuthenticated)

/**
 * Routes
 */
router.use('/admin', require('./admin'))
router.use('/user', require('./user'))
router.use('/file', require('./file'))
router.use('/storage', require('./storage'))

// Logout
router.delete('/login',
	AuthenticationController.logout)
	
// Get Articles from Subgroup
router.get('/admin/subgroup/:subgroupId/articles',
	ArticleController.getArticlesFromSubgroup)

// Get Article Subgroups from Main Storages
router.get('/admin/main-storages/subgroups',
	ArticleSubgroupController.getCategoriesFromMainStorages)

router.get('/store/settings',
	SettingsController.getOrCreateStoreSettings)

// Update Admin Settings
router.patch('/admin/:adminId/settings',
	uploadImage.single('imageUpload'),
	SettingsController.updateStoreSettings)

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

router.post('/admin/:ownerId/table/create',
	TablesController.createTable)

// Get Tables by Owner id
router.get('/admin/:ownerId/tables',
	TablesController.getTablesByOwnerId)

// Get Table by id
router.get('/admin/:ownerId/table/:tableId',
	TablesController.getTable)

// Delete Table
router.delete('/admin/:ownerId/table/:tableId',
	TablesController.deleteTable)

// Create Order
router.post('/admin/:ownerId/table/:currentTableId/order',
	OrderController.createOrder)

// Get Orders by Table id
router.get('/admin/:ownerId/table/:currentTableId/order',
	OrderController.getOrdersByTableId)

// Delete Order by id
router.delete('/admin/:ownerId/table/:currentTableId/order/:orderId',
	OrderController.deleteOrder)

// Reserve Articles
router.post('/admin/:ownerId/table/:currentTableId/order/:orderId/reserve',
	OrderController.reserveArticles)

// Get Reserved Articles by Table id
router.get('/admin/:ownerId/table/:currentTableId/reserved-articles',
	OrderController.getReservedArticles)

module.exports = router