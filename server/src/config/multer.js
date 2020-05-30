const multer = require('multer')
const path = require('path')

// Setup multer image storage engine
const multerImageStorage = multer.diskStorage({
	// Destination of uploaded images
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../../uploads/images'))
	},
	// Define image name
	filename: (req, file, cb) => {
		// TODO: Use uuid
		cb(null, Date.now() + '-' + file.originalname)
	}
})

// Image file filter [allow only jpg, png]
const imageFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') return cb(null, true)
	// Reject a file
	else return cb(null, false)
}

// Init img upload
const uploadImage = multer({
	storage: multerImageStorage,
	// Max image file size
	limits: { fileSize: 1024 * 1024 * 3 },
	fileFilter: imageFilter
})

module.exports = {
	uploadImage: uploadImage
}