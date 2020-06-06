const { app, dialog } = require('electron')

function aboutPanelOptions() {
	return {
		applicationName: 'Caffe Manager',
		applicationVersion: `App version: ${app.getVersion()}`,
		version: 'Build version: App build version number..',
		website: 'Website: App website..',
		authors: 'Author: Author info..',
		credits: 'Credits: Credit info..',
		copyright: 'Copyright © Caffe Manager - All rights reserved'
		// iconPath: ''
	}
}

function developerMenuItem(app, mainWindow) {
	return {
		label: 'Developer',
		submenu: [
			{
				label: 'Developer Tools',
				role: 'toggleDevTools'
			},
			// {
			// 	label: 'About',
			// 	click() {
			// 		dialog.showMessageBox(mainWindow, {
			// 			type: 'info',
			// 			title: 'About',
			// 			message: `Caffe Manager`,
			// 			detail: `
			// 				Version: ${app.getVersion()}
			// 				Path: ${app.getAppPath()}
			// 			`
			// 		})
			// 	}
			// },
			{
				label: 'About',
				accelerator: 'Shift + Alt + A',
				click() {
					app.showAboutPanel()
				}
			},
			{ type: 'separator' },
			{
				label: 'CPU and Memory',
				click() {
					const metrics = app.getAppMetrics()
					metrics.forEach((m) => {
						metricsArr.push(`
							CPU type: ${m.type}
							CPU usage: ${Math.round(m.cpu.percentCPUUsage)} %
							Memory: ${Math.round(m.memory.workingSetSize / 1024)} MB
							Memory max: ${Math.round(m.memory.peakWorkingSetSize / 1024)} MB
							Private memory: ${Math.round(m.memory.privateBytes / 1024)} MB
						`)
					})
					dialog.showMessageBox(mainWindow, {
						type: 'info',
						title: 'CPU and Memory',
						message: 'CPU and Memory',
						detail: `${metricsArr.join('')}`
					})
				}
			},
			{
				label: 'GPU Info',
				click() {
					app.getGPUInfo('complete').then(info => {
						dialog.showMessageBox(mainWindow, {
							type: 'info',
							title: 'GPU Info',
							message: 'GPU Info',
							detail: `
								GL Version: ${info.auxAttributes.glVersion}
								GL Renderer: ${info.auxAttributes.glRenderer}
								GL Vendor: ${info.auxAttributes.glVendor}
							`
						})
					})
				}
			}
		]
	}
}

module.exports = {
	aboutPanelOptions: aboutPanelOptions,
	developerMenuItem: developerMenuItem
}