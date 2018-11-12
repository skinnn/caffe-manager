const express = require('express')
const router = express.Router()
const passport = require('passport')
const dateHandler = require('../controllers/getDate')
const fs = require('fs')
const path = require('path')
const multer = require('multer')

// Controllers
const AuthenticationController = require('../controllers/AuthenticationController')
const SettingsController = require('../controllers/SettingsController')
const AdminController = require('../controllers/AdminController')
const StorageController = require('../controllers/StorageController')
const ArticleController = require('../controllers/ArticleController')
const ArticleSubgroupController = require('../controllers/ArticleSubgroupController')
const TablesController = require('../controllers/TablesController')
const OrderController = require('../controllers/OrderController')
const auth = require('../controllers/ensureAuthenticated')

// Policies
const AuthenticationControllerPolicy = require('../policies/AuthenticationControllerPolicy')
// const ensureAuthenticated = require('../controllers/ensureAuthenticated')

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

// Time stamp
router.use(function timeLog(req, res, next) {
  console.log('Route hit - Time: ', new Date().toJSON())
  next()
})

// TODO: Secure all endpoints so only logged in admin can access it

// Get Articles from Subgroup
router.get('/admin/subgroup/:subgroupId/articles',
  ArticleController.getArticlesFromSubgroup)

// Get Article Subgroups from Main Storages
router.get('/admin/main-storages/subgroups',
  ArticleSubgroupController.getSubgroupsFromMainStorages)

// Create Article Subgroup
router.post('/admin/storage/:storageId/subgroup/create',
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

router.get('/find/root',
  AdminController.createRootAdmin)

// Get or Create Admin Settings
router.get('/admin/:adminId/settings',
  SettingsController.getOrCreateAdminSettings)

// Update Admin Settings
router.put('/admin/:adminId/settings',
  upload.single('imageUpload'),
  SettingsController.updateAdminSettings)

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

// User Login
router.post('/user/login',
  AuthenticationController.loginUser)

// User Logout
router.get('/user/logout',
  AuthenticationController.logoutUser)

// Admin Login
router.post('/admin/login',
  AuthenticationController.loginAdmin)

// Admin Logout
router.get('/admin/logout',
  AuthenticationController.logoutAdmin)

// Register User
router.post('/user/register',
  upload.single('imageUpload'),
  AuthenticationControllerPolicy.registerUser,
  AuthenticationController.registerUser)

// Register Admin
router.post('/admin/register',
  upload.single('imageUpload'),
  AuthenticationControllerPolicy.registerAdmin,
  AuthenticationController.registerAdmin)

// Get all Admins
router.get('/admin/admins',
  AdminController.getAllAdmins)

// Get Admin by id
router.get('/admin/:adminId',
  AdminController.getAdminById)

// Update Admin
router.put('/admin/:adminId',
  AdminController.saveAdmin)

// Update User
router.put('/admin/user/:userId',
  upload.single('imageUpload'),
  AuthenticationControllerPolicy.updateUser,
  AdminController.updateUser)

// Get User by id
router.get('/admin/user/:userId',
  AdminController.getUserById)

// Create Storage
router.post('/admin/storage/create',
  StorageController.createStorage)

// Update Storage
router.put('/storage/:storageId',
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
router.put('/article/:articleId',
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

module.exports = router
