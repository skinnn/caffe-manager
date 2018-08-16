const User = require('../models/User')

module.exports = {
  // Get user menu
  async getUserHome(req, res) {
    try {
      let query = { username: 'user' }
      const user = await User.findOne(query, function(err, user) {
        if (err) {
          console.log(err)
        } else {
          console.log(user)
          res.send(user)
        }
      })
      // console.log(req.user)
      // const user = req.user
      // res.send(user)
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to get the menu.'
      })
    }
  }
}
