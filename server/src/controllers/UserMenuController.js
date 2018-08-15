const User = require('../models/User')

module.exports = {
  // Get user menu
  async getUserMenu(req, res) {
    try {
      const users = await User.find({}, function(err, users) {
        if (err) {
          console.log(err)
        } else {
          res.send(users)
        }
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to get the menu.'
      })
    }
  }
}
