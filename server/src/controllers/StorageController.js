const passport = require('passport')
const Storage = require('../models/Storage')
module.exports = {

  // Create Storage
  async createStorage(req, res) {
    try {
      let storage = new Storage()
      console.log(req.body)
      storage.name = req.body.storageName
      // Check if the name is typed and create storage in the db
      if (storage.name !== '') {
        await storage.save(function(err) {
          if (err) {
            return console.log(err)
          } else {
            res.send({
              saved: true,
              success: 'Storage created.'
            })
            console.log('Storage has been successfuly created.')
          }
        })
      } else {
        return console.log('Error: Storage must have a name.')
      }
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to create the storage.'
      })
    }
  },

  // Get All Storages
  async getAllStorages(req, res) {
    try {
      await Storage.find({}, function(err, storages) {
        if (err) {
          console.log(err)
        } else {
          console.log(storages)
          res.send({
            storages: storages
          })
        }
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to get the list of storages.'
      })
    }
  },

  // Get Storage by id
  async getStorageById(req, res) {
    try {
      let query = req.params.storageId
      await Storage.getStorageById(query, function(err, storage) {
        if (err) {
          console.log(err)
        } else {
          res.send({
            storage: storage
          })
        }
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to get the storage data.'
      })
    }
  },

  // Update Storage by id
  async saveStorage(req, res) {
    try {
      let query = {_id: req.params.storageId}

      await Storage.update(query, req.body, function(err, storage) {
        if (err) {
          console.log(err)
        } else {
          res.send({
            storage: storage
          })
        }
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to update the storage data.'
      })
    }
  }

} /* Module exports */
