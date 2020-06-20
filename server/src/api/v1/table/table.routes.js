const express = require('express')
const router = express.Router()

// Controllers
const TableController = require('./table.controller')

router.post('/admin/:user_id/table/create',
	TableController.createTable)

// Get Tables by Owner id
router.get('/admin/:user_id/tables',
	TableController.getTablesByuser_id)

// Get Table by id
router.get('/admin/:user_id/table/:tableId',
	TableController.getTable)

// Delete Table
router.delete('/admin/:user_id/table/:tableId',
	TableController.deleteTable)

module.exports = router