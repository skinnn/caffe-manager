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
      const getMainStorageIds = async() => {
        const query = { type: 'Main' }
        let storages = await Storage.find(query)
        if (storages.length > 0) {
          let ids = []
          storages.forEach(function(storage) {
            ids.push(storage._id)
          })
          return ids
        } else {
          return res.status(400).send({
            noMainStorages: true,
            error: `There are no Main storages.`
          })
        }
      }

      const storageIds = await getMainStorageIds()

      const getAllSubgroups = async() => {
        let allSubgroups = []
        for (let i = 0; i < storageIds.length; i++) {
          let mainStorageId = { inWhichStorage: storageIds[i] }
          let subgroups = await ArticleSubgroup.find(mainStorageId)
          subgroups.forEach(function(subgroup) {
            allSubgroups.push(subgroup)
          })
        }
        console.log('Finished: ', allSubgroups)
        return allSubgroups
      }
      // let result = await getAllSubgroups()
      res.send({
        subgroups: await getAllSubgroups()
      })
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
