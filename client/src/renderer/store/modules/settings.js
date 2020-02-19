const state = {
	settings: JSON.parse(localStorage.getItem('settings')) || null
}

const mutations = {
	SET_SETTINGS(state, settings) {
		state.settings = settings
	},
	REMOVE_SETTINGS(state) {
		state.settings = null
	}
}

const actions = {
	setSettings({ commit }, settings) {
		return new Promise((resolve, reject) => {
			localStorage.setItem('settings', JSON.stringify(settings))
			commit('SET_SETTINGS', settings)
			resolve(settings)
		})
	},

	removeSettings({ commit }) {
		commit('REMOVE_SETTINGS')
	}
}

const getters = {
	getSettings(state) {
		return state.admin
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
