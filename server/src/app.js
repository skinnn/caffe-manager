const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const path = require('path')
// const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const index = require('./routes/index')

const port = process.env.PORT || 8081

app.use(morgan('combined'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
// Connect Flash
app.use(flash())

// Express-session middleware
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Express-validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    let namespace = param.split('.')
    let root = namespace.shift()
    let formParam = root

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

// Global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

// Routes
app.use('/', index)

// Passport config
const User = require('./models/user')
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err
      if (!user) {
        return done(null, false, {message: 'Unknown User'})
      }
      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, {message: 'Invalid password'})
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

// Connect to a local Mongo Database
mongoose.connect('mongodb://localhost/vue-caffe')
  .then(() => console.log('Database connected!'))
  .catch((err) => console.error(err))

app.listen(port, function() {
  console.log(`Listening on port: ${port}`)
})
