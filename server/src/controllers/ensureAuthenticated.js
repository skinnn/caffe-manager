
// Make sure that authenticated user is trying to get the page
module.exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    console.log('You must be logged in to access this route.')
    res.send({
      message: 'You are not logged in.'
    })
  }
}
