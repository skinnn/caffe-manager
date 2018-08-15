const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const Admin = require('../models/Admin')
const User = require('../models/User')

module.exports = function(passport) {
  // User Local Strategy
  passport.use(new LocalStrategy(function(username, password, done) {
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

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user)
    })
  })

  // Admin Local Strategy
  // passport.use(new LocalStrategy(function(username, password, done) {
  //   Admin.getAdminByUsername(username, function(err, admin) {
  //     if (err) throw err
  //     if (!admin) {
  //       return done(null, false, { error: 'Unknown Admin' })
  //     }
  //     Admin.comparePassword(password, admin.password, function(err, isMatch) {
  //       if (err) throw err
  //       if (isMatch) {
  //         return done(null, admin)
  //       } else {
  //         return done(null, false, { error: 'Invalid password' })
  //       }
  //     })
  //   })
  // }))

  // passport.serializeUser(function(admin, done) {
  //   done(null, admin.id)
  // })
  //
  // passport.deserializeUser(function(id, done) {
  //   Admin.getAdminById(id, function(err, admin) {
  //     done(err, admin)
  //   })
  // })

/* Modules exports */
}
