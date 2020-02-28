const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('./middleware/logger')
const app = express()
const path = require('path')
// const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
// const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash')
const index = require('./routes/index')
const UserController = require('./controllers/UserController')

// Load config
const config = require('./config/config')

// Middleware
app.use(logger)
app.use(cors({
	credentials: true,
	origin: 'http://localhost:9080'
}))
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
// require('./config/passport')(passport)
// // Passport middleware
// app.use(passport.initialize())
// app.use(passport.session())

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// Static image folder
app.use('/images', express.static(path.join(__dirname, '../images')))

// Routes
app.use(`${config.baseApiURL}`, index)

// Connect to a local Mongo Database
mongoose
	.connect(config.db.uri, {
    useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false, // Fixing deprecation for findOneAndUpdate() query
    useCreateIndex: true
  })
  .then(() => {
		console.log('Database connected.')

    // Start the server
    app.listen(config.port, () => {
			// Create root admin if it does not exist
      console.log(`Listening on port: ${config.port}`)
			UserController.createRootAdmin()
    })
  })
  .catch((err) => console.error(err))
