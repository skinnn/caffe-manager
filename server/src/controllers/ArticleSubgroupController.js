const passport = require('passport')
const ArticleSubgroup = require('../models/ArticleSubgroup')
const Storage = require('../models/Storage')
module.exports = {

  // Create Article Subgroup
  async createArticleSubgroup(req, res) {
    try {
      // console.log('BODY: ', req.body)
      // console.log('PARAMS: ', req.params)
      let subgroup = new ArticleSubgroup()
      subgroup.name = req.body.name
      subgroup.inWhichStorage = req.params.storageId

      // Validation
      if (subgroup.name !== '' && subgroup.inWhichStorage !== '') {
        await subgroup.save(function(err) {
          if (err) {
            return console.log(err)
          } else {
            return res.send({
              saved: true,
              subgroup: subgroup,
              success: 'Subgroup created.'
            })
          }
        })
      } else {
        return res.status(400).send({
          error: 'Please fill out all required fields.'
        })
      }
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to create the subgroup.'
      })
    }
  },

  // Get Article Subgroups from the Main Storage/s
  async getSubgroupsFromMainStorages(req, res) {
    try {
      const query = { type: 'Main' }
      var mainStorageIds = []

      await Storage
        .find(query)
        .exec()
        .then(storages => {
          if (storages.length > 0) {
            // Go through all Main Storages and fetch their IDs
            for (let i = 0; i < storages.length; i++) {
              mainStorageIds.push(storages[i]._id)
              // Last iteration
              if (i === storages.length - 1) {
                console.log('TOTAL IDS:', mainStorageIds.length)
              }
            }
          }
        })
        .then(storages => {
          var allSubgroups = []
          var start = 0
          mainStorageIds.forEach(function(id) {
            let mainStorageId = { inWhichStorage: id }
            ArticleSubgroup
              .find(mainStorageId)
              .exec()
              .then(subgroups => {
                // console.log(subgroups)
                subgroups.forEach(function(subgroup) {
                  allSubgroups.push(subgroup)
                })
              })
              .catch(err => console.log(err))
            while (start < mainStorageIds.length) {
              start++
              console.log('Working... ', start)
              if (start === mainStorageIds.length) {
                setTimeout(function() {
                  console.log('1s delay: ', allSubgroups.length)
                  res.send({
                    subgroups: allSubgroups
                  })
                }, 1000)
              }
            }
          })
        })
        .catch(err => console.log(err))
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to get the subgroups.'
      })
    }
  },

  // Get Article Subgroups by storage id
  async getSubgroupsByStorageId(req, res) {
    try {
      let query = { inWhichStorage: req.params.storageId }
      await ArticleSubgroup.find(query, function(err, subgroups) {
        if (err) {
          return console.log(err)
        } else {
          return res.send({
            subgroups: subgroups
          })
        }
      })
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to get the subgroups.'
      })
    }
  }

  // // TODO: Update Article Subgroups by id
  // async saveStorage(req, res) {
  //   try {
  //     let query = {_id: req.params.storageId}
  //
  //     await Storage.findOneAndUpdate(query, req.body, function(err, storage) {
  //       if (err) {
  //         console.log(err)
  //       } else {
  //         res.send({
  //           storage: storage
  //         })
  //       }
  //     })
  //   } catch (err) {
  //     res.status(500).send({
  //       error: 'An error has occurred trying to update the storage data.'
  //     })
  //   }
  // }

} /* Module exports */
