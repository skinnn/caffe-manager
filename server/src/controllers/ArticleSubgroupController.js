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

      await Storage
        .find(query)
        .exec()
        .then(storages => {
          // If there are any Main Storages
          if (storages.length > 0) {
            for (let i = 0; i < storages.length; i++) {
              var allSubgroups = []
              console.log('Current Storage: ', storages[i])
              let mainStorageId = { inWhichStorage: storages[i]._id }
              ArticleSubgroup
                .find(mainStorageId)
                .exec()
                .then(subgroups => {
                  subgroups.forEach(function(subgroup) {
                    console.log('Current subgrup: ', subgroup)
                    allSubgroups.push(subgroup)
                  })
                  // console.log('ONE PUSH:', allSubgroups)
                  if (i === storages.length - 1) {
                    res.send({
                      subgroups: allSubgroups
                    })
                    console.log('All subgroups from main storages: ', allSubgroups)
                  }
                })
                .catch(err => console.log(err))
            }
          }
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
