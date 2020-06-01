const state = {
	notifications: JSON.parse(localStorage.getItem('notifications')) || []
}

const mutations = {
	ADD_NOTIFICATION(state, notification) {
		state.notifications.push(notification)
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
	},
	clearNotifications({ commit }) {
		commit('CLEAR_NOTIFICATIONS')
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
