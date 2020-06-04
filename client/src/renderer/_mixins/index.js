import Vue from 'vue'

/**
 * Global mixins (methods available globally)
 */

Vue.mixin({
	methods: {
		_getCurrentTime() {
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

			return date + time
		}
	}
})
