const express = require('express')
const router = express.Router()
const Auth = require('../../middleware/authentication')

// Controllers
const UserController = require('./user/user.controller')

// Get Login list of users/admins - not using authentication
router.get('/user/login-list',
	UserController.getLoginList)

router.use('/auth', require('./auth/auth.routes'))

// Authentication
router.use(Auth.ensureAuthenticated)

router.use('/user', require('./user/user.routes'))
router.use('/file', require('./file/file.routes'))
router.use('/storage', require('./storage/storage.routes'))
router.use('/store', require('./store/store.routes'))

module.exports = router