
// Make sure that authenticated user is trying to get the route
module.exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.status(403).send({
      error: 'You are not logged in.'
    })
  }
}

// TODO: Separate auth controller for user and admin

// module.exports.isAdminLoggedIn = function(req, res, next) {
//   if (req.admin.userType === 'admin') {
//     console.log(req.admin)
//     return next()
//   } else {
//     res.send({
//       message: 'Access denied.'
//     })
//     console.log('Access denied (not admin).')
//   }
// }
//
// module.exports.isUserLoggedIn = function(req, res, next) {
//   if (req.user.userType === 'user') {
//     console.log(req.user)role
//     return next()
//   } else {
//     res.send({
//       message: 'Access denied.'
//     })
//     console.log('Access denied (not user).')
//   }
// }
