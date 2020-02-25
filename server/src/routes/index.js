const express = require('express')
const router = express.Router()
// const passport = require('passport')
// const dateHandler = require('../controllers/getDate')
// const fs = require('fs')
// const path = require('path')
const multer = require('multer')

// Middleware
const auth = require('../middleware/authentication')

// Controllers
const AuthenticationController = require('../controllers/AuthenticationController')
const SettingsController = require('../controllers/SettingsController')
const AdminController = require('../controllers/AdminController')
const StorageController = require('../controllers/StorageController')
const ArticleController = require('../controllers/ArticleController')
const ArticleSubgroupController = require('../controllers/ArticleSubgroupController')
const TablesController = require('../controllers/TablesController')
const OrderController = require('../controllers/OrderController')
const UserController = require('../controllers/UserController')

// Policies
const UserControllerPolicy = require('../policies/UserControllerPolicy')

// TODO: Move multer config to separate file
// Multer storage engine
const multerStorage = multer.diskStorage({
	// Destination of uploaded images
	destination: function(req, file, cb) {
		cb(null, './images')
	},
	// Define image name
	filename: function(req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname)
	}
})

// File filter for uploading images - allow only jpg and png
const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true)
	} else {
		// Reject a file
		cb(null, false)
	}
}

// Init img upload
const upload = multer({
	storage: multerStorage,
	// Max file/image size
	limits: {
		fileSize: 1024 * 1024 * 3
	},
	fileFilter: fileFilter
})

// router.use('/images', express.static(path.join(__dirname, '/../../images')))
// console.log(path.join(__dirname, '/../../images'))

// TODO: Secure endpoints so only authenticated user/admin can access them

// Login
router.post('/login',
	AuthenticationController.login)
	
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
	upload.single('imageUpload'),
	ArticleSubgroupController.createArticleSubgroup)

// Get Article Subgroup list by storage id
router.get('/admin/storage/:storageId/subgroups',
	ArticleSubgroupController.getSubgroupsByStorageId)

// Get User login list
router.get('/user/login-list',
	AdminController.getUserLoginList)

// Get Admin login list
router.get('/admin/login-list',
	AdminController.getAdminLoginList)

// TODO: Modify to POST /reinit (route that only root user can use to flush the database and reinitialize the app )
// router.get('/find/root',
// 	AdminController.createRootAdmin)

// Get or Create Store Settings
// router.get('/admin/:adminId/settings',
// 	SettingsController.getOrCreateStoreSettings)

router.get('/store/settings',
	auth.ensureAuthenticated,
	SettingsController.getOrCreateStoreSettings)

// Update Admin Settings
router.patch('/admin/:adminId/settings',
	upload.single('imageUpload'),
	SettingsController.updateStoreSettings)

// Get all Articles
router.get('/admin/articles',
	ArticleController.getAllArticles)

// Delete Admin
router.delete('/admin/:adminId',
	AdminController.deleteAdmin)

// Delete User
router.delete('/admin/:adminId/user/:userId',
	AdminController.deleteUser)

// Get Storage by id
router.get('/admin/storage/:storageId',
	StorageController.getStorageById)

// Get all Storages
router.get('/admin/storages',
	StorageController.getAllStorages)

// Get all users
router.get('/admin/users',
	AdminController.getAllUsers)

// Register User
router.post('/user',
	upload.single('imageUpload'),
	UserControllerPolicy.user,
	UserController.createUser)

// Create Admin
router.post('/admin',
	upload.single('imageUpload'),
	UserControllerPolicy.admin,
	AdminController.createAdmin)

// Get all Admins
router.get('/admin',
	auth.ensureAuthenticated,
	UserController.getAllAdmins)

// Get Admin by id
router.get('/admin/:adminId',
	AdminController.getAdminById)

// Update Admin
router.patch('/admin/:adminId',
	AdminController.updateAdminById)

// Update User
router.patch('/admin/user/:userId',
	upload.single('imageUpload'),
	UserControllerPolicy.updateUser,
	AdminController.updateUser)

// Get User by id
router.get('/admin/user/:userId',
	AdminController.getUserById)

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
	upload.single('imageUpload'),
	ArticleController.createArticle)

// Get Article by id
router.get('/admin/storage/:storageId/article/:articleId',
	ArticleController.getArticleById)

// Update Article
router.patch('/article/:articleId',
	upload.single('imageUpload'),
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
	
// router.post('/new-login',
// 	AuthenticationController.login)

module.exports = router
