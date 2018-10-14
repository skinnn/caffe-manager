const AdminSettings = require('../models/Settings')
const dateHandler = require('./getDate')

module.exports = {

  // Get or Create Admin Settings if it doesn't exist
  async getOrCreateAdminSettings(req, res) {
    try {
      let query = {}
      let update = { type: 'settings' }
      let options = { upsert: true, new: true, setDefaultsOnInsert: true }

      await AdminSettings.findOneAndUpdate(query, update, options, function(err, settings) {
        if (err) {
          return res.status(500).send({
            error: 'An error has occurred trying to fetch the settings.'
          })
        } else {
          return res.send({
            settings: settings
          })
        }
      })
    } catch (err) {
      console.log(err)
      return res.status(500).send({
        error: 'An error has occurred trying to fetch the settings.'
      })
    }
  },

  // Update Admin Settings
  async updateAdminSettings(req, res) {
    try {
      let query = { type: 'settings' }
      let options = { upsert: true, new: true }

      let settings = {}
      settings.store_name = req.body.storeName
      settings.store_address = req.body.storeAddress
      settings.currency = req.body.storeCurrency
      settings.store_phone1 = req.body.storePhone1
      settings.store_phone2 = req.body.storePhone2
      settings.updated_date = await dateHandler.getCurrentTime()

      // If image is changed update the image path
      if (req.file !== undefined && req.file !== '') {
        // TODO: If there is previous store image delete it from the images folder
        settings.store_image = req.file.path
      } else {
        // If there is no new image
        settings.store_image = req.body.oldImage
      }

      await AdminSettings.findOneAndUpdate(query, settings, options, function(err, settings) {
        if (err) {
          return res.status(500).send({
            error: 'A database error has occurred trying to update the settings. Please try again.'
          })
        } else {
          return res.send({
            saved: true,
            settings: settings,
            success: 'Settings updated successfully.'
          })
        }
      })
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to update the settings data.'
      })
    }
  }

// Module Exports
}
