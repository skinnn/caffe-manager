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
			let selectedArticles = req.body.selectedArticles
			// console.log('SELECTED ARTS: ', selectedArticles);

			async function saveAllArticlesToDb() {
				await selectedArticles.forEach(function(article) {

					// Check for name and quantity and save reserved articles in the db
					if (article.name === '' || article.quantity === '' || article.quantity === 0) {
						return res.status(400).send({
							error: 'Invalid article name and/or quantity.'
						})
					}
	
					let reservedArticle = new ReservedArticle({
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
	
					// Save Reserved Article in the db
					reservedArticle.save(function(err) {
						if (err) {
							return console.log(err)
						}
						console.log(reservedArticle.name + ' is saved in the DB. ')
					})
				})

				return true;
			}

			var areAllArticlesSaved = await saveAllArticlesToDb();
			console.log('areAllArticlesSaved???????????', areAllArticlesSaved);

			return res.send({
				saved: true,
				success: 'Articles reserved successfully.'
			})

			










      // let selectedArticlesLength = await req.body.selectedArticles.length
      // // If there are no selected articles return info message
      // if (selectedArticlesLength <= 0) {
      //   return res.send({
      //     saved: false,
      //     info: 'You must select at least one article for reserving.'
      //   })
      // }

      // // Save all selected articles
      // const saveSelectedArticles = async() => {
			// 	console.log('SELECTED ARTICLES LENGTH: ', selectedArticlesLength)
				

      //   for (let i = 0; i <= selectedArticlesLength - 1; i++) {
      //     let reservedArticle = new ReservedArticle()
      //     reservedArticle.name = req.body.selectedArticles[i].name
      //     reservedArticle.quantity = req.body.selectedArticles[i].quantity
      //     reservedArticle.image = req.body.selectedArticles[i].image
      //     reservedArticle.updated_date = dateHandler.getCurrentTime()
      //     reservedArticle.inWhichOrder = req.body.orderId
      //     reservedArticle.reservedBy = req.body.ownerId
      //     reservedArticle.inWhichTable = req.body.currentTableId
      //     reservedArticle.price = req.body.selectedArticles[i].price
      //     reservedArticle.total_price = reservedArticle.price * reservedArticle.quantity
      //     // Check for name and quantity and save reserved articles in the db
      //     if (reservedArticle.name !== '' && reservedArticle.quantity !== '') {
      //       await reservedArticle.save(function(err) {
      //         if (err) {
      //           return console.log(err)
      //         }
      //         console.log(reservedArticle.name + ' is saved in the DB. ' + i)
      //       })
      //     } else {
      //       return res.status(400).send({
      //         error: 'Invalid article information.'
      //       })
      //     }
      //   }

      //   return selectedArticlesLength
      // }

      // let result = await saveSelectedArticles()
      // console.log('RESULT: ', result)
      // if (result > 0) {
      //   return res.send({
      //     saved: true,
      //     success: 'Articles reserved.'
      //   })
      // } else {
      //   return res.send({
      //     saved: false,
      //     error: 'Error: result is 0.'
      //   })
			// }
			
    } catch (err) {
      console.log(err)
      res.status(500).send({
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

      await Order.remove(query, function(err) {
        if (err) {
          res.status(500).send({
            error: 'A database error has occurred trying to delete the order.'
          })
        }
        res.send({
          deleted: true,
          success: 'Order deleted.'
        })
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to delete the order.'
      })
    }
  }

} /* Module exports */
