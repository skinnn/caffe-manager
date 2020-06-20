const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const config = require('../config/config.js')

const secret = config.authentication.jwtSecret

const checkToken = (token) => {
	return new Promise((resolve, reject) => {
		if (token) {
			jwt.verify(token, secret, (err, decoded) => {
				if (err) resolve({ validToken: false, decoded: null })

				resolve({ validToken: token, decoded })
			})
		}
		reject(false)
	})
}

// Sign user
const jwtSignUser = (user) => {
	const payload = {
		id: user.id,
		roles: user.roles,
		username: user.username
	}
	const secret = config.authentication.jwtSecret
	const expiresFor = '7d' // Eg: 60, "2 days", "10h", "7d".
	// const validNotBefore = '2 days'

	return jwt.sign(payload, secret, {
		expiresIn: expiresFor
	})
}

// // Return current date and time
// const getCurrentTime = () => {
// 	let currentTime = new Date()
// 	// returns the month (from 0 to 11)
// 	let month = currentTime.getMonth() + 1
// 	// returns the day of the month (from 1 to 31)
// 	let day = currentTime.getDate()
// 	// returns the year (four digits)
// 	let year = currentTime.getFullYear()

// 	let seconds = currentTime.getSeconds()
// 	let minutes = currentTime.getMinutes()
// 	let hour = currentTime.getHours()

// 	let date = day + '.' + month + '.' + year + '.' + '  -  '
// 	let time = hour + 'h : ' + minutes + 'm : ' + seconds + 's'

// 	let currentDateAndTime = date + time
// 	return currentDateAndTime
// }

/**
 * Transform value to a boolean. Strings starting with letters: t, y, 1 will be transformed to true.
 * @param 	{Object} 	value	 [Value to be transformed]
 */
const toBoolean = (value) => {
	if (typeof value !== 'string') value = Boolean(value)

	const s = value.toLowerCase()
	value = ['t', 'y', '1'].some(prefix => s.startsWith(prefix))
	return value
}

/**
 * Checks if an object is empty (if obj has any properties)
 * @param 	{Object} 	obj	 [Object to be evaluated]
 * @return	{Boolean}			 [Returns boolean true or false]
 */
const isEmptyObject = (obj) => {
	if (!obj) throw new Error('Value not specified')
	if (obj && obj.constructor !== Object || obj === null) throw new TypeError('The provided value is not of type Object')
	return obj && obj.constructor === Object && Object.keys(obj).length === 0
}

/**
 * Checks if 2 arrays have at least 1 common element
 * @param 	{Array} 		arr1 		[First array, should be a bigger one for better performance]
 * @param 	{Array} 		arr2 		[Second array]
 * @return 	{Boolean}						[Returns a boolean true or false]
 */
const haveCommonElements = (arr1, arr2) => {
	if (!arr1 || !arr2) throw new Error('Both arrays must be specified')
	const arr1Set = new Set(arr1)
	return arr2.some(el => arr1Set.has(el))
}

/**
 * 
 * @param 	{String} 	startPath 	[Directory path from where to search]
 * @param 	{*} 			filter 			[Filter - file name or extension to match]
 * @return 	{Array}								[Returns an array of objects with file names and paths]
 */
const filesFromDir = (startPath, filter) => {
	const allFiles = []
	
	const fromDir = (startPath, filter) => {
		if (!fs.existsSync(startPath)) {
			return console.log('Directory not found: ', startPath)
		}

		var files = fs.readdirSync(startPath)
		for (var i=0; i < files.length; i++) {
			var filename = path.join(startPath, files[i])
			var stat = fs.lstatSync(filename)

			// Recurse
			if (stat.isDirectory()) fromDir(filename, filter)
			else if (filename.indexOf(filter) >= 0) {
				// console.log('-- found: ', filename)
				
				allFiles.push({
					name: filename.split('/').pop(),
					path: filename
				})
			}
		}
	}

	fromDir(startPath, filter)
	return allFiles
}

module.exports = {
	checkToken,
	jwtSignUser,
	toBoolean,
	isEmptyObject,
	haveCommonElements,
	filesFromDir
	// getCurrentTime
}