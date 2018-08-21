const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const Admin = require('../models/Admin')
const User = require('../models/User')

module.exports = function(passport) {
  // User Local Strategy
  passport.use('user', new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err
      if (!user) {
        return done(null, false, { error: 'Unknown User' })
      }
      User.compareUserPassword(password, user.password, function(err, isMatch) {
        if (err) throw err
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, { error: 'Wrong password' })
        }
      })
    })
  }))

  // Admin Local Strategy
  passport.use('admin', new LocalStrategy(function(username, password, done) {
    Admin.getAdminByUsername(username, function(err, admin) {
      if (err) throw err
      if (!admin) {
        return done(null, false, { error: 'Unknown Admin' })
      }
      Admin.compareAdminPassword(password, admin.password, function(err, isMatch) {
        if (err) throw err
        if (isMatch) {
          return done(null, admin)
        } else {
          return done(null, false, { error: 'Invalid password' })
        }
      })
    })
  }))

  passport.serializeUser(function(user, done) {
    var key = {
      id: user.id,
      type: user.userType
    }
    done(null, key)
  })

  passport.deserializeUser(function(key, done) {
    // This could be more complex with a switch or if statements
    var Model = key.type === 'user' ? User : Admin

    Model.findOne({_id: key.id}, '-salt -password', function(err, user) {
      done(err, user)
    })
  })

/* Module exports */
}
