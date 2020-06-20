import AppNotification from '../../lib/Notification'

const state = {
	visibility: false,
	notifications: JSON.parse(localStorage.getItem('notifications')) || []
}

const mutations = {
	ADD_NOTIFICATION(state, notification) {
		let newNotif = new AppNotification(notification)
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
	},
	SET_VISIBILITY(state, isVisible) {
		state.visibility = isVisible
	}
}

const actions = {
	addNotification({ commit }, notification) {
		commit('ADD_NOTIFICATION', notification)
	},
	removeNotification({ commit }, id) {
		commit('REMOVE_NOTIFICATION', id)
	},
	clearNotifications({ commit }) {
		commit('CLEAR_NOTIFICATIONS')
	},
	setNotificationsVisibility({ commit }, isVisible) {
		commit('SET_VISIBILITY', isVisible)
	}
}

const getters = {
	getNotifications(state) {
		return state.notifications
	},
	getNotificationCount(state) {
		return state.notifications.length
	},
	getNotificationsVisibility(state) {
		return state.visibility
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
