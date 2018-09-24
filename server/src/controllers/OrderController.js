const passport = require('passport')
const Order = require('../models/Order')
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
        return console.log('Error: Order must have a name.')
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
  }

} /* Module exports */
