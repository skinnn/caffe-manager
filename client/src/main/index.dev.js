/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Set environment for development
process.env.NODE_ENV = 'development'

// Install `electron-debug` with `devtron`
// require('electron-debug')

// Install `vue-devtools`
require('electron').app.on('ready', () => {
	const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')
	
  installExtension(VUEJS_DEVTOOLS)
    .then((extension) => {
			console.log(`Added Extension: ${extension.name}`)
		})
    .catch(err => {
      console.log(`Unable to install ${extension.name}: \n`, err)
		})		
})

// Require `main` process to boot app
require('./index')
