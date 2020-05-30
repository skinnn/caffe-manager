const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const path = require('path')
// const favicon = require('serve-favicon')
// const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const UserController = require('./controllers/UserController')

// Master config
const config = require('./config/config')

// Middleware
app.use(morgan('dev'))
app.use(cors({
	credentials: true,
	origin: 'http://localhost:9080'
}))
// Parse application/json
app.use(express.json())
// Parse application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// app.use(cookieParser())
// Connect Flash
// app.use(flash())

// Express-session middleware
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

// Global Variables
// app.use((req, res, next) => {
// 	console.log('locals: ', res.locals)
// 	next()
// })

// Static assets
// app.use('/public', express.static(path.join(__dirname, '../public')))

// Mount main router
app.use('/', require('./routes/index'))

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
