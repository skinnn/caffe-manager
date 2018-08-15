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
// const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash')
const index = require('./routes/index')

const config = require('./config/config')

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

// Passport config
require('./config/passport')(passport)
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

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

// Logout when nodemon restarts the server
// app.get('*', function(req, res, next) {
//   res.locals.user = req.user || null
//   next()
// })

// Connect to a local Mongo Database
mongoose.connect('mongodb://localhost:27017/vue-caffe', {useNewUrlParser: true})
  .then(() => {
    console.log('Database connected!')
    // Start server
    app.listen(config.port, function() {
      console.log(`Listening on port: ${config.port}`)
    })
  })
  .catch((err) => console.error(err))
