const express = require('express')
const router = express.Router()

const SettingsController = require('./setting.controller')

/* Base: /settings
===================================================== */

router.post('/',
SettingsController.createSettings)

module.exports = router