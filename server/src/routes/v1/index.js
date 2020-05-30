const express = require('express')
const router = express.Router()
const { uploadImage } = require('../../config/multer')
const Auth = require('../../middleware/authentication')

// Controllers
const AuthenticationController = require('../../controllers/AuthenticationController')
const SettingsController = require('../../controllers/SettingsController')
const AdminController = require('../../controllers/AdminController')
const StorageController = require('../../controllers/StorageController')
const ArticleController = require('../../controllers/ArticleController')
const ArticleSubgroupController = require('../../controllers/ArticleSubgroupController')
const TablesController = require('../../controllers/TablesController')
const OrderController = require('../../controllers/OrderController')
const UserController = require('../../controllers/UserController')

// Login - not using authentication
router.post('/login',
	AuthenticationController.login)

// Get Login list of users/admins - not using authentication
router.get('/login-list/:role',
	UserController.getLoginList)

// Authentication
router.use(Auth.ensureAuthenticated)

/**
 * Routes
 */
router.use('/admin', require('./admin'))
router.use('/user', require('./user'))
router.use('/file', require('./file'))
	
// Logout
router.post('/logout',
	AuthenticationController.logout)




// Get Articles from Subgroup
router.get('/admin/subgroup/:subgroupId/articles',
	ArticleController.getArticlesFromSubgroup)

// Get Article Subgroups from Main Storages
router.get('/admin/main-storages/subgroups',
	ArticleSubgroupController.getSubgroupsFromMainStorages)

// Create Article Subgroup
router.post('/admin/storage/:storageId/subgroup/create',
	uploadImage.single('imageUpload'),
	ArticleSubgroupController.createArticleSubgroup)

// Get Article Subgroup list by storage id
router.get('/admin/storage/:storageId/subgroups',
	ArticleSubgroupController.getSubgroupsByStorageId)

router.get('/store/settings',
	SettingsController.getOrCreateStoreSettings)

// Update Admin Settings
router.patch('/admin/:adminId/settings',
	uploadImage.single('imageUpload'),
	SettingsController.updateStoreSettings)

// Get all Articles
router.get('/admin/articles',
	ArticleController.getAllArticles)

// Get Storage by id
router.get('/admin/storage/:storageId',
	StorageController.getStorageById)

// Get all Storages
router.get('/admin/storages',
	StorageController.getAllStorages)

// Update Admin
router.patch('/admin/:adminId',
	AdminController.updateAdminById)

// Create Storage
router.post('/admin/storage/create',
	StorageController.createStorage)

// Update Storage
router.patch('/storage/:storageId',
	StorageController.saveStorage)

// Get Articles by storage id
router.get('/admin/storage/:storageId/articles',
	ArticleController.getArticlesByStorageId)

// Delete Article
router.delete('/article/:articleId',
	ArticleController.deleteArticle)

// Create Article
router.post('/admin/article/create',
	uploadImage.single('imageUpload'),
	ArticleController.createArticle)

// Get Article by id
router.get('/admin/storage/:storageId/article/:articleId',
	ArticleController.getArticleById)

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
