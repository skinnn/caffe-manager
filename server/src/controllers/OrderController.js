const passport = require('passport')
const Order = require('../models/Order')
const ReservedArticle = require('../models/ReservedArticle')
const dateHandler = require('./getDate')
module.exports = {

  // Create Order
  async createOrder(req, res) {
    try {
      // console.log(`OWNER: ${req.params.ownerId}`)
      // console.log(`CURRENT TABLE: ${req.params.currentTableId}`)
      // console.log(req.body)
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
  },

  // Reserve Articles
  async reserveArticles(req, res) {
    try {
      // console.log('PARAMS: ', req.params)
      // console.log('BODY: ', req.body)
      for (let i = 0; i <= req.body.selectedArticles.length - 1; i++) {
        // console.log('RESERVED: ', req.body.selectedArticles[i])
        let reservedArticle = new ReservedArticle()
        reservedArticle.name = req.body.selectedArticles[i].name
        reservedArticle.quantity = req.body.selectedArticles[i].quantity
        reservedArticle.image = req.body.selectedArticles[i].image
        reservedArticle.updated_date = dateHandler.getCurrentTime()
        reservedArticle.inWhichOrder = req.body.orderId
        reservedArticle.reservedBy = req.body.ownerId
        reservedArticle.inWhichTable = req.body.currentTableId
        // Check for name and quantity and save reserved articles in the db
        if (reservedArticle.name !== '' && reservedArticle.quantity !== '') {
          await reservedArticle.save(function(err) {
            if (err) {
              return console.log(err)
            }
          })
        } else {
          return res.status(400).send({
            error: 'Invalid article information.'
          })
        }
      }
      res.send({
        saved: true,
        success: 'Articles reserved.'
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occurred trying to reserve the articles.'
      })
    }
  }

} /* Module exports */
