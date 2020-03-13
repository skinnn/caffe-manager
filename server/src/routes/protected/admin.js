const express = require('express')
const router = express.Router()
const multer = require('multer')

// Controllers
const UserController = require('../../controllers/UserController')

// Policies
const UserControllerPolicy = require('../../policies/UserControllerPolicy')

// Middleware
const auth = require('../../middleware/authentication')

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

/* /admin middleware
===================================================== */

router.use(auth.ensureAuthenticated)

// Development middleware
if (process.env.NODE_ENV === 'development') {
	router.use((req, res, next) => {
		console.log('user: ', req.user)
		console.log('admin: ', req.admin)
		next()
	})
}

/* /admin routes
===================================================== */

// Create Admin
router.post('/',
	upload.single('profileImage'),
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