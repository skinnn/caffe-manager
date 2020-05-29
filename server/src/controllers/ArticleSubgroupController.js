const ArticleSubgroup = require('../models/ArticleSubgroup')
const Storage = require('../models/Storage')

module.exports = {

  // Create Article Subgroup
  async createArticleSubgroup(req, res) {
    try {
      // console.log('BODY: ', req.body)
      // console.log('PARAMS: ', req.params)
      // console.log('FILE: ', req.file)
      let subgroup = new ArticleSubgroup()
      subgroup.name = req.body.subgroupName
      subgroup.inWhichStorage = req.params.storageId

      // If image is added create image path
      if (req.file !== undefined && req.file !== '') {
        subgroup.image = req.file.path
        // console.log('IMG', subgroup.image)
      } else {
        subgroup.image = ''
      }

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
          if (subgroups.length > 0) {
            subgroups.forEach(function(subgroup) {
              allSubgroups.push(subgroup)
            })
          } else {
            console.log(`\nNo Subgroups in storage: ${storageIds[i]}\n`)
          }
        }
        console.log(`Total number of found subgrups: ${allSubgroups.length}\n` + allSubgroups)
        return allSubgroups
      }

      let result = await getAllSubgroups()
      if (result.length > 0) {
        res.send({
          subgroups: result
        })
      } else {
        res.status(400).send({
          noSubgroups: true,
          error: `There are no Subgroups in Main storage/s.`
        })
      }
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
