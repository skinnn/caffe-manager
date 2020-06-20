'use strict'

const { app, BrowserWindow, Menu, dialog, nativeImage, shell } = require('electron')
const createMenuTemplate = require('./menu/menu')
const AuthService = require('../renderer/services/AuthService')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// Icon path
let iconPath = __static + '/logo/caffe_manager_1024x1024.png'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'	
	? `http://localhost:9080`
	: `file://${__dirname}/index.html`

function createWindow() {
	/**
   * Initial window options
   */
	mainWindow = new BrowserWindow({
		show: false,
		// alwaysOnTop: true,
		title: 'Caffe Manager',
		height: 800,
		width: 1400,
		minHeight: 800,
		minWidth: 1400,
		center: true,
		useContentSize: true,
		// If fullscreen is on, turn off mainWindow.maximize()
		// fullscreen: true,
		icon: iconPath,
		resizable: true,
		webPreferences: {
			nodeIntegration: true
		}
	})

	// Load file
	mainWindow.loadURL(winURL)

	// Load menu
	const menuTemplate = createMenuTemplate(mainWindow)
	Menu.setApplicationMenu(menuTemplate)
	// console.log(Menu.getApplicationMenu().commandsMap)

	/**
	 * Main window events
	 */
	mainWindow.on('close', (e) => {
		// // Prompt the user before quitting
		// var choice = dialog.showMessageBoxSync(mainWindow, {
		// 	type: 'question',
		// 	buttons: ['Yes', 'No'],
		// 	title: 'Confirm',
		// 	message: 'Are you sure you want to quit?',
		// 	detail: ''
		// })
		// if (choice === 1) {
		// 	e.preventDefault()
		// }
	})

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
		mainWindow.maximize()
		mainWindow.webContents.openDevTools()
	})
} /* createWindow */

/**
 * App events
 */
app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})
