const express = require('express')
const router = express.Router()
const config = require('../config/config')

// TODO: Secure endpoints so only authenticated user/admin can access them, exponse only POST /login

// Mount REST API routes
router.use('/', require('./v1/index'))

// TODO: Move to Controller, create better handler with status code mapping
// Error handler
// router.use((err, req, res, next) => {
// 	console.error(err)
// 	return res.status(500).json({
// 		from: 'Error handler',
// 		error: err,
// 		stack: err.stack
// 	})
// })

module.exports = router