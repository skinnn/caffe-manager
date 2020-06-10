const express = require('express')
const router = express.Router()

// Development middleware
if (process.env.NODE_ENV === 'development') {
	// router.use((req, res, next) => {
	// 	next()
	// })
}

// Mount REST API routes
router.use('/', require('./v1/index'))

module.exports = router