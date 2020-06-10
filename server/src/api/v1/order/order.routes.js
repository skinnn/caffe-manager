const express = require('express')
const router = express.Router()

const OrderController = require('./order.controller')

// Create Order
router.post('/admin/:user_id/table/:currentTableId/order',
	OrderController.createOrder)

// Get Orders by Table id
router.get('/admin/:user_id/table/:currentTableId/order',
	OrderController.getOrdersByTableId)

// Delete Order by id
router.delete('/admin/:user_id/table/:currentTableId/order/:orderId',
	OrderController.deleteOrder)

module.exports = router