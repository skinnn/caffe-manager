const express = require('express')
const router = express.Router()
const passport = require('passport')
const multer = require('multer')
const auth = require('../controllers/ensureAuthenticated')
const dateHandler = require('../controllers/getDate')
const fs = require('fs')
const path = require('path')
const AuthenticationController = require('../controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('../policies/AuthenticationControllerPolicy')

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
router.post('/login-user',
  AuthenticationController.loginUser)

// Admin Login
router.post('/login-admin',
  AuthenticationController.loginAdmin)

// Register User
router.post('/register-user',
  AuthenticationControllerPolicy.register,
  AuthenticationController.registerUser)

// Register Admin
router.post('/register-admin',
  AuthenticationControllerPolicy.register,
  AuthenticationController.registerAdmin)

module.exports = router
