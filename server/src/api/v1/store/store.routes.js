const express = require('express')
const router = express.Router()

const StoreController = require('./store.controller')

/* Base: /store
===================================================== */

router.post('/', StoreController.createStore)
router.get('/', StoreController.getAllStores)
router.get('/:id', StoreController.getStoreById)

module.exports = router