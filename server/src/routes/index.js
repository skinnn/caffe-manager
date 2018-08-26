const express = require('express')
const router = express.Router()
const passport = require('passport')
const multer = require('multer')
const dateHandler = require('../controllers/getDate')
const fs = require('fs')
const path = require('path')

// Controllers
const AuthenticationController = require('../controllers/AuthenticationController')
const AdminController = require('../controllers/AdminController')
const StorageController = require('../controllers/StorageController')
const ArticleController = require('../controllers/ArticleController')
const auth = require('../controllers/ensureAuthenticated')

// Policies
const AuthenticationControllerPolicy = require('../policies/AuthenticationControllerPolicy')
// const ensureAuthenticated = require('../controllers/ensureAuthenticated')

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

// Create Article
router.post('/admin/storage/:storageId/article/create',
  ArticleController.createArticle)

// Get all Articles
router.get('/admin/storage/:storageId/articles',
  ArticleController.getArticlesByStorageId)

// Delete Article
router.delete('/article/:articleId',
  ArticleController.deleteArticle)

module.exports = router
