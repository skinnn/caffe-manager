const express = require('express')
const router = express.Router()
const passport = require('passport')
const dateHandler = require('../controllers/getDate')
const fs = require('fs')
const path = require('path')
const multer = require('multer')

// Controllers
const AuthenticationController = require('../controllers/AuthenticationController')
const AdminController = require('../controllers/AdminController')
const StorageController = require('../controllers/StorageController')
const ArticleController = require('../controllers/ArticleController')
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

// Time stamp
router.use(function timeLog(req, res, next) {
  console.log('Route hit - Time: ', new Date().toJSON())
  next()
})

// TODO: Secure all routes only for admin and user

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
  AuthenticationControllerPolicy.registerUser,
  AuthenticationController.registerUser)

// Register Admin
router.post('/admin/register',
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
  AdminController.saveUser)

// Get User by id
router.get('/admin/user/:userId',
  AdminController.getUserById)

// Create Storage
router.post('/admin/storage/create',
  StorageController.createStorage)

// Update Storage
router.put('/storage/:storageId',
  StorageController.saveStorage)

// Get all Articles
router.get('/admin/storage/:storageId/articles',
  ArticleController.getArticlesByStorageId)

// Delete Article
router.delete('/article/:articleId',
  ArticleController.deleteArticle)

const Article = require('../models/Article')
// Upload image
// router.post('/admin/article/create',
//   upload.single('articleImage'),
//   async function(req, res) {
//     try {
//       console.log('upload hit')
//       console.log('FILE: ', req.file)
//       console.log('FILES: ', req.files)
//       console.log('BODY:', req.body)
//       res.send({
//         filePath: req.file.path,
//         uploaded: true
//       })
//     } catch (err) {
//       console.log(err)
//       res.send({
//         error: err
//       })
//     }
//   })

/* --------------------------------------------------------- */

// let article = new Article()
// article.name = req.body.name
// article.quantity = req.body.quantity
// article.inStorage = req.body.storageId
// article.price = req.body.price
//
// if (req.file !== undefined && req.file !== '') {
//   article.image = req.file.path
//   console.log('IMG', article.image)
//   console.log('IMG', article.image)
//   console.log('IMG', article.image)
//   console.log('IMG', article.image)
// } else {
//   article.image = ''
// }
//
// // Check if the name is typed and create article in the db
// if (article.name !== '') {
//   article.save(function(err) {
//     if (err) {
//       console.log(err)
//       // res.status(500).send({
//       //   error: 'A database error has occurred trying to save the article. Please try again.'
//       // })
//     } else {
//       res.send({
//         saved: true,
//         success: 'Article created.'
//       })
//     }
//   })
// } else {
//   res.status(400).send({
//     error: 'Article must have a name.'
//   })
// }

router.post('/admin/article/create',
  upload.single('imageUpload'),
  ArticleController.createArticle)

// Create Article
router.post('/admin/storage/:storageId/article/create',
  upload.single('articleImage'),
  ArticleController.createArticle)

module.exports = router
