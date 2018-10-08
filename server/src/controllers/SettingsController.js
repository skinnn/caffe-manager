const AdminSettings = require('../models/Settings')
module.exports = {

  // Get Admin Settings
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
  }

}
