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

// Load config
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
  resave: false,
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
  next()
})

// Static image folder
app.use('/images', express.static(path.join(__dirname, '../images')))

// Routes
app.use('/api', index)

// Connect to a local Mongo Database
mongoose.connect(config.db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Database connected!')
    // Start server
    app.listen(config.port, function() {
      console.log(`Listening on port: ${config.port}`)
    })
  })
  .catch((err) => console.error(err))
