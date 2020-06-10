const Order = require('./order.model')
// const ReservedArticle = require('../models/ReservedArticle')
const helpers = require('../../../lib/helpers')

module.exports = {

	// Create Order
	async createOrder(req, res, next) {
		try {
			let order = new Order()
			order.name = req.body.newOrderName
			order.inWhichTable = req.params.currentTableId
			order.user_id = req.params.user_id
			// TODO: Validation with Joi
			// Check if the name is typed and create order in the db
			if (order.name !== '' && order.name !== undefined) {
				await order.save((err) => {
					if (err) throw err
					return res.status(201).json({
						orderId: order._id,
						name: order.name,
						saved: true,
						success: 'Order created.'
					})
				})
			} else {
				return res.status(400).json({
					error: 'Order must have a name.'
				})
			}
		} catch (err) {
			return next(err)
		}
	},

	// Get Orders by Table id
	async getOrdersByTableId(req, res, next) {
		try {
			// console.log('Body: ', req.body)
			// console.log('Params: ', req.params)
			let tableId = { inWhichTable: req.params.currentTableId }
			await Order.find(tableId, (err, orders) => {
				if (err) throw err
				return res.status(200).json({
					orders: orders
				})
			})
		} catch (err) {
			return next(err)
		}
	},

	// Reserve Articles
	// TODO: Refactor, fix bugs
	// async reserveArticles(req, res, next) {
	// 	try {
	// 		const selectedArticles = req.body.selectedArticles
	// 		let articlesToSave = []

	// 		selectedArticles.forEach((article) => {
	// 			let articleWithAllData = new ReservedArticle({
	// 				name: article.name,
	// 				quantity: article.quantity,
	// 				image: article.image,
	// 				updated: helpers.getCurrentTime(),
	// 				inWhichOrder: req.body.orderId,
	// 				reservedBy: req.body.user_id,
	// 				inWhichTable: req.body.currentTableId,
	// 				price: article.price,
	// 				total_price: article.price * article.quantity
	// 			})

	// 			articlesToSave.push(articleWithAllData)
	// 		})

	// 		// Save all reserved articles in the database
	// 		ReservedArticle.insertMany(articlesToSave, (err) => {
	// 			if (err) throw err

	// 			console.log('\nAll articles have been saved')
	// 			return res.status(201).json({
	// 				saved: articlesToSave,
	// 				success: 'Articles reserved successfully.'
	// 			})
	// 		})
	// 	} catch (err) {
	// 		return next(err)
	// 	}
	// },

	// Get Reserved Articles by Table id
	// async getReservedArticles(req, res, next) {
	// 	try {
	// 		let tableId = { inWhichTable: await req.params.currentTableId }
	// 		await ReservedArticle.find(tableId, (err, reservedArticles) => {
	// 			if (err) throw err
	// 			return res.status(200).json({
	// 				reservedArticles: reservedArticles
	// 			})
	// 		})
	// 	} catch (err) {
	// 		return next(err)
	// 	}
	// },

	// Delete Article
	async deleteOrder(req, res, next) {
		try {
			let query = {_id: req.params.orderId}

			await Order.deleteOne(query, (err) => {
				if (err) throw err
				
				return res.status(200).json({
					deleted: true,
					success: 'Order deleted.'
				})
			})
		} catch (err) {
			return next(err)
		}
	}

} /* Module exports */