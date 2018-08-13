
// Make sure that authenticated user is trying to get the page
module.exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/login')
  }
}
