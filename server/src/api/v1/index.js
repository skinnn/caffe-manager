const express = require('express')
const router = express.Router()

const Authentication = require('../../lib/Authentication')

const Controller = require('../../lib/Controller')
const UserController = require('./user/user.controller')

// Get Login list of users/admins - not using authentication
router.get('/user/login-list',
	UserController.getUsersByRole)

// Authentication middleware
router.use(Authentication.ensureAuthenticated)

// Endpoints
router.use('/auth', require('./auth/auth.routes'))
router.use('/user', require('./user/user.routes'))
router.use('/file', require('./file/file.routes'))
router.use('/storage', require('./storage/storage.routes'))
router.use('/store', require('./store/store.routes'))
router.use('/category', require('./category/category.routes'))
router.use('/article', require('./article/article.routes'))

// Output response middleware
router.use(Controller.responseHandler)

module.exports = router