const express = require('express')
const router = express.Router()
const { uploadImage } = require('../../config/multer')

// Controllers
const UserController = require('../../controllers/user.controller')

// Policies
const UserControllerPolicy = require('../../policies/UserControllerPolicy')

// Middleware
const auth = require('../../middleware/authentication')

/* /admin middleware
===================================================== */

router.use(auth.ensureAuthenticated)

// Development middleware
if (process.env.NODE_ENV === 'development') {
	router.use((req, res, next) => {
		console.log('user: ', req.user)
		console.log('admin: ', req.user)
		next()
	})
}

/* /admin routes
===================================================== */

// Create Admin
router.post('/',
	uploadImage.single('profileImage'),
	UserControllerPolicy.admin,
	UserController.createUser)

// Get all Admins
router.get('/',
	UserController.getAllAdmins)

// Get Admin by id
router.get('/:id',
	UserController.getUserById)

// Delete Admin by id
router.delete('/:id',
	UserController.deleteUserById)

module.exports = router