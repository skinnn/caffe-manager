const state = {
	settings: JSON.parse(localStorage.getItem('settings')) || null
}

const mutations = {
	SET_SETTINGS(state, settings) {
		state.settings = settings
	}
}

const actions = {
	setSettings({ commit }, settings) {
		return new Promise((resolve, reject) => {
			localStorage.setItem('settings', JSON.stringify(settings))
			commit('SET_SETTINGS', settings)
			resolve(true)
		})
	}
}

const getters = {
	getSettings(state) {
		return state.settings
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
