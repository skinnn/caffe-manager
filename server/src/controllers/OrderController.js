const passport = require('passport')
const Order = require('../models/Order')
const ReservedArticle = require('../models/ReservedArticle')
const dateHandler = require('./getDate')
module.exports = {

  // Create Order
  async createOrder(req, res) {
    try {
      let order = new Order()
      order.name = req.body.newOrderName
      order.inWhichTable = req.params.currentTableId
      order.ownerId = req.params.ownerId
      // Check if the name is typed and create order in the db
      if (order.name !== '' && order.name !== undefined) {
        await order.save(function(err) {
          if (err) {
            return console.log(err)
          } else {
            res.send({
              orderId: order._id,
              name: order.name,
              saved: true,
              success: 'Order created.'
            })
          }
        })
      } else {
        return res.status(400).send({
          error: 'Order must have a name.'
        })
      }
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to create the order.'
      })
    }
  },

  // Get Orders by Table id
  async getOrdersByTableId(req, res) {
    try {
      // console.log('Body: ', req.body)
      // console.log('Params: ', req.params)
      let tableId = { inWhichTable: req.params.currentTableId }
      await Order.find(tableId, function(err, orders) {
        if (err) {
          res.status(500).send({
            error: 'A database error has occurred trying to find orders. Please try again.'
          })
        } else {
          res.send({
            orders: orders
          })
        }
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to get the orders.'
      })
    }
  },

  // Reserve Articles
  async reserveArticles(req, res) {
    try {
			const selectedArticles = req.body.selectedArticles
			let articlesToSave = []

			selectedArticles.forEach(function(article) {

				let articleWithAllData = new ReservedArticle({
					name: article.name,
					quantity: article.quantity,
					image: article.image,
					updated_date: dateHandler.getCurrentTime(),
					inWhichOrder: req.body.orderId,
					reservedBy: req.body.ownerId,
					inWhichTable: req.body.currentTableId,
					price: article.price,
					total_price: article.price * article.quantity,
				})

				articlesToSave.push(articleWithAllData)
			})

			// Save all reserved articles in the database
			ReservedArticle.insertMany(articlesToSave, function(err) {
				if (err) {
					console.log(err)
					return res.status(500).send({
						error: 'An error has occurred trying to reserve the articles.'
					})
				}

				console.log('\nAll articles have been saved');
				return res.send({
					saved: articlesToSave,
					success: 'Articles reserved successfully.'
				})
			})

    } catch (err) {
      console.log(err)
      return res.status(500).send({
        error: 'An error has occurred trying to reserve the articles.'
      })
    }
  },

  // Get Reserved Articles by Table id
  async getReservedArticles(req, res) {
    try {
      // console.log('Body: ', req.body)
      // console.log('Params: ', req.params)
      let tableId = { inWhichTable: await req.params.currentTableId }
      await ReservedArticle.find(tableId, function(err, reservedArticles) {
        if (err) {
          return res.status(500).send({
            error: 'A database error has occurred trying to find the reservedArticles. Please try again.'
          })
        } else {
          return res.send({
            reservedArticles: reservedArticles
          })
        }
      })
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to get the reservedArticles.'
      })
    }
  },

  // Delete Article
  async deleteOrder(req, res) {
    try {
      let query = {_id: req.params.orderId}

      await Order.deleteOne(query, function(err) {
        if (err) {
          return res.status(500).send({
            error: 'A database error has occurred trying to delete the order.'
          })
				}
				
        return res.send({
          deleted: true,
          success: 'Order deleted.'
        })
			})
			
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to delete the order.'
      })
    }
  }

} /* Module exports */
