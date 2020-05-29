const Storage = require('../models/Storage')

module.exports = {

  // Create Storage
  async createStorage(req, res) {
    try {
      let storage = new Storage()
      storage.name = req.body.storageName
      storage.type = req.body.type
      // Validation
      if (storage.name !== '' && storage.type !== '') {
        await storage.save(function(err) {
          if (err) {
            return console.log(err)
          } else {
            return res.send({
              saved: true,
              success: 'Storage created.'
            })
          }
        })
      } else {
        return res.status(400).send({
          error: 'Please fill out all required fields.'
        })
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

      await Storage.findOneAndUpdate(query, req.body, function(err, storage) {
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
