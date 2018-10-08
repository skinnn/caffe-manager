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
      // For each article in the reservedArticle array get and save data
      for (let i = 0; i <= req.body.selectedArticles.length - 1; i++) {
        // console.log('RESERVED: ', req.body.selectedArticles[i])
        let reservedArticle = new ReservedArticle()
        reservedArticle.name = await req.body.selectedArticles[i].name
        reservedArticle.quantity = await req.body.selectedArticles[i].quantity
        reservedArticle.image = await req.body.selectedArticles[i].image
        reservedArticle.updated_date = await dateHandler.getCurrentTime()
        reservedArticle.inWhichOrder = await req.body.orderId
        reservedArticle.reservedBy = await req.body.ownerId
        reservedArticle.inWhichTable = await req.body.currentTableId
        reservedArticle.price = await req.body.selectedArticles[i].price
        reservedArticle.total_price = await reservedArticle.price * reservedArticle.quantity
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
      return res.send({
        saved: true,
        success: 'Articles reserved.'
      })
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