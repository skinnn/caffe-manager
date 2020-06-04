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
	const payload = {
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

// Return current date and time
const getCurrentTime = () => {
	let currentTime = new Date()
	// returns the month (from 0 to 11)
	let month = currentTime.getMonth() + 1
	// returns the day of the month (from 1 to 31)
	let day = currentTime.getDate()
	// returns the year (four digits)
	let year = currentTime.getFullYear()

	let seconds = currentTime.getSeconds()
	let minutes = currentTime.getMinutes()
	let hour = currentTime.getHours()

	let date = day + '.' + month + '.' + year + '.' + '  -  '
	let time = hour + 'h : ' + minutes + 'm : ' + seconds + 's'

	let currentDateAndTime = date + time
	return currentDateAndTime
}

module.exports = {
	checkToken,
	jwtSignUser,
	getCurrentTime
}