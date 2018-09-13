const passport = require('passport')
const Table = require('../models/Table')
const dateHandler = require('./getDate')
const fs = require('fs')

module.exports = {

  // Create Table
  async createTable(req, res) {
    try {
      let table = new Table()
      table.number = req.body.number
      table.ownerId = req.body.ownerId

      // console.log(req.body)
      await table.save(function(err) {
        if (err) {
          res.status(500).send({
            error: 'A database error has occurred trying to save the table. Please try again.'
          })
        } else {
          res.send({
            created: true,
            success: 'Table was successfully created.'
          })
        }
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occurred trying to create the table.'
      })
    }
  },

  // Get All Articles
  async getTablesByOwnerId(req, res) {
    try {
    } catch (err) {
      let ownerIdQuery = { ownerId: req.params.ownerId }
      await Table.find(ownerIdQuery, function(err, tables) {
        if (err) {
          res.status(500).send({
            error: 'A database error has occurred trying to find tables. Please try again.'
          })
        } else {
          res.send({
            tables: tables
          })
        }
      })
      res.status(500).send({
        error: 'An error has occurred trying to get the list of your tables.'
      })
    }
  },

  // Get Article by id
  async getTableById(req, res) {
    try {
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to get the table data.'
      })
    }
  },

  // Update Table by id
  async saveTable(req, res) {
    try {
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to update the storage data.'
      })
    }
  },

  // Delete Table
  async deleteTable(req, res) {
    try {
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to delete the table.'
      })
    }
  }

} /* Module exports */
