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
      if (table.number !== '' && table.number !== undefined) {
        await table.save(function(err) {
          if (err) {
            console.log(err)
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
      } else {
        res.status(400).send({
          info: 'Table not specified.'
        })
      }
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
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to get the list of your tables.'
      })
    }
  },

  // Get Article by id
  async viewTable(req, res) {
    try {
      let query = { _id: req.params.tableId }
      // console.log(`OWNER: ${ownerId}, TABLE: ${tableIdQuery}`)
      await Table.findOne(query, function(err, table) {
        if (err) {
          res.status(500).send({
            error: 'A database error has occurred trying to find the table. Please try again.'
          })
        } else {
          res.send({
            table: table
          })
        }
      })
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
      // console.log(`TABLE ID: ${req.params.tableId}`)
      // console.log(`OWNER ID: ${req.params.ownerId}`)
      const query = { _id: req.params.tableId }
      const ownerId = req.params.ownerId
      await Table.deleteOne(query, function(err) {
        if (err) {
          res.status(500).send({
            error: 'A database error has occurred trying to delete the table.'
          })
        }
        res.send({
          deleted: true,
          success: 'Table deleted.'
        })
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to delete the table.'
      })
    }
  }

} /* Module exports */
