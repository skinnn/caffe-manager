const express = require('express')
const router = express.Router()
const config = require('../config/config')

// TODO: Secure endpoints so only authenticated user/admin can access them, exponse only POST /login

// REST API routes (use base url defined in the master config)
router.use(`${config.baseApiURL}`, require('./v1/index'))

// Error handler
router.use((err, req, res, next) => {
	console.error(err)
	return res.status(500).json({
		from: 'Error handler',
		error: err,
		stack: err.stack
	})
})

module.exports = router