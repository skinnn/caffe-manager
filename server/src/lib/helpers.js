const jwt = require('jsonwebtoken')
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
	console.log('signing: ', user)
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
const isEmptyObject = obj => {
	if (!obj) throw new Error('Value not specified')
	if (obj && obj.constructor !== Object || obj === null) throw new TypeError('The provided value is not of type Object')
	return obj && obj.constructor === Object && Object.keys(obj).length === 0
}

module.exports = {
	checkToken,
	jwtSignUser,
	toBoolean,
	isEmptyObject
	// getCurrentTime
}