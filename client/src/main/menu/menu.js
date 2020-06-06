const { Menu, MenuItem, shell, app, dialog } = require('electron')
const dev = require('./dev.js')

// shell.showItemInFolder(fullPath)

function createMenuTemplate(mainWindow) {
	let menuTemplate = [
		{
			label: 'File',
			submenu: [
				{
					label: 'Exit',
					click() { 
						app.quit()
					}
				}
			]
		},
		{
			label: 'Help',
			registerAccelerator: true,
			submenu: [
				{
					label: 'Contact',
					click() {
						shell.openExternal('mailto:nikola.devbusiness@gmail.com')
					}
				}
			]
		}
	]

	if (process.env.NODE_ENV === 'development') {
		const aboutPanelOptions = dev.aboutPanelOptions(app)
		const developerMenuItem = dev.developerMenuItem(app, mainWindow)

		app.setAboutPanelOptions(aboutPanelOptions)
		menuTemplate.push(developerMenuItem)
	}

	// Register app menu
	return Menu.buildFromTemplate(menuTemplate)
}

module.exports = createMenuTemplate