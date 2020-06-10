const express = require('express')
const router = express.Router()

const StoreController = require('./store.controller')

/**
 * Base: /store
 */

router.post('/settings', require('./settings/settings.routes'))

module.exports = router