'use strict'

import { app, BrowserWindow } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// Icon path
let iconPath = process.cwd() + '/static/logo/logomark.png'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    minHeight: 650,
    minWidth: 1100,
    center: true,
    useContentSize: true,
    // fullscreen: true,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true
    },
    title: 'Caffe Manager'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('close', function(e) {
    // Prompt the user before quitting with yes or no
    var choice = require('electron').dialog.showMessageBox(this,
      {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'Are you sure you want to quit?'
      })
    if (choice === 1) {
      e.preventDefault()
    }
  })
}

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
