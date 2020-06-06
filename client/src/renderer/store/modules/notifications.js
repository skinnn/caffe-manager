import Notification from '../../lib/Notification'

const state = {
	notifications: JSON.parse(localStorage.getItem('notifications')) || []
}

const mutations = {
	ADD_NOTIFICATION(state, notification) {
		let newNotif = new Notification(notification)
		state.notifications.push(newNotif)
		localStorage.setItem('notifications', JSON.stringify(state.notifications))
	},
	REMOVE_NOTIFICATION(state, id) {
		state.notifications.forEach((el, i) => el.id === id ? state.notifications.splice(i, 1) : null)
		localStorage.setItem('notifications', JSON.stringify(state.notifications))
	},
	CLEAR_NOTIFICATIONS(state) {
		state.notifications = []
		localStorage.setItem('notifications', JSON.stringify(state.notifications))
	}
}

const actions = {
	addNotification({ commit }, notification) {
		commit('ADD_NOTIFICATION', notification)
	},
	removeNotification({ commit }, id) {
		commit('REMOVE_NOTIFICATION', id)
		// Remove from localStorage
		// let localNotifs = JSON.parse(localStorage.getItem('notifications'))
		// localNotifs.forEach((notif, index) => notif.id === id ? localNotifs.splice(index, 1) : null)
		// localStorage.setItem('notifications', JSON.stringify(localNotifs))
	},
	clearNotifications({ commit }) {
		commit('CLEAR_NOTIFICATIONS')
		// localStorage.setItem('notifications', [])
	}
}

const getters = {
	getNotifications(state) {
		return state.notifications
	}
	// getNotificationById(state, id) {
	// 	return state.notifications.find((el) => el.id === id)
	// }
}

export default {
	state,
	mutations,
	actions,
	getters
}
