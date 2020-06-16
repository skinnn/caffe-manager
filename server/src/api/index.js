const express = require('express')
const router = express.Router()
const Controller = require('../lib/Controller')

// // Development middleware
// if (process.env.NODE_ENV === 'development') {
// 	router.use((req, res, next) => {
// 		next()
// 	})
// }

// Main API middleware
router.use(Controller.middleware)

// Mount REST API routes
router.use('/', require('./v1/index'))

module.exports = router