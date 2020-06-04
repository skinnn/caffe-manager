const express = require('express')
const cors = require('cors')
const morganLogger = require('morgan')
const http = require('http')
// const favicon = require('serve-favicon')
const Controller = require('./lib/Controller')

// Master config
const masterConfig = require('./config/config')

// Express app instance
const app = express()

// Global middleware
app.use(morganLogger('dev'))
app.use(cors({
	credentials: true,
	origin: 'http://localhost:9080'
}))
// Parse application/json
app.use(express.json())
// Parse application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// Static assets
// app.use('/public', express.static(path.join(__dirname, '../public')))

// Boot the server
Controller.boot(masterConfig, app).then((ctx) => {
	// Create http or https server
	if (ctx.api.protocol === 'https') {
		// const https = require('https')
		// ctx.api.server = https.createServer(ctx.getSSLOptions(), app)
	} else {
		ctx.api.server = http.createServer(app)
	}

	// Mount main router with all the endpoints, mount to path specified in the master config
	ctx.app.use(`${ctx.api.baseApiURL}`, require('./routes/index'))

	// Error handler
	ctx.app.use((err, req, res, next) => ctx.errorHandler(err, req, res, next))

	// Start the server
	ctx.api.server.listen(ctx.api.port, async () => {
		console.log(`Server started on: ${ctx.api.protocol}://${ctx.api.host}:${ctx.api.port} in ${process.env.NODE_ENV}`)
	})
})
.catch(err => Controller.logError(err))