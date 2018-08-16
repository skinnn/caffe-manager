
// Make sure that authenticated user is trying to get the route
module.exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    console.log('You must be logged in or authorized to access this route.')
    res.send({
      message: 'You are not logged in.'
    })
  }
}
