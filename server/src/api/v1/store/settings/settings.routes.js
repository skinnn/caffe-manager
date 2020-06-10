const express = require('express')
const router = express.Router()

const StoreSettingsController = require('./settings.controller')

router.get('/',
StoreSettingsController.createStoreSettings)

module.exports = router