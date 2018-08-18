const express = require('express')
const router = express.Router()
const passport = require('passport')
const multer = require('multer')
const auth = require('../controllers/ensureAuthenticated')
const dateHandler = require('../controllers/getDate')
const fs = require('fs')
const path = require('path')

// Controllers
const AuthenticationController = require('../controllers/AuthenticationController')

// Policies
const AuthenticationControllerPolicy = require('../policies/AuthenticationControllerPolicy')
// const ensureAuthenticated = require('../controllers/ensureAuthenticated')

// Models
const Storage = require('../models/Storage')
const User = require('../models/User')
const Article = require('../models/Article')
const Table = require('../models/Table')
const Order = require('../models/Order')
const ReservedArticle = require('../models/ReservedArticle')

// Time stamp
router.use(function timeLog(req, res, next) {
  console.log('Route hit - Time: ', new Date().toJSON())
  next()
})

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

module.exports = router
