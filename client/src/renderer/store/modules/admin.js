const state = {
	admin: JSON.parse(localStorage.getItem('admin')) || null,
	token: JSON.parse(localStorage.getItem('token')) || null,
	isAdminLoggedIn: false
}

const mutations = {
	SET_ADMIN(state, admin) {
		state.admin = admin
		if (admin) {
			state.isAdminLoggedIn = true
		} else {
			state.isAdminLoggedIn = false
		}
	},
	SET_ADMIN_TOKEN(state, token) {
		state.token = token
	},
	REMOVE_ADMIN(state) {
		state.admin = null
	},
	REMOVE_ADMIN_TOKEN(state) {
		state.token = null
	}
}

const actions = {
	// Set all data when admin logs in
	loginAdmin(context, data) {
		return new Promise((resolve, reject) => {
			const isAdminSet = context.dispatch('setAdmin', data.admin)
			const isTokenSet = context.dispatch('setToken', data.token)
			console.log('TOK: ', data.token)

			if (isAdminSet && isTokenSet) resolve(data.admin, data.token)
			else reject(new Error('Could not set admin and token.'))
		})
	},

	logoutAdmin(context) {
		return new Promise((resolve, reject) => {
			const isAdminRemoved = context.dispatch('setAdmin', null)
			const isTokenRemoved = context.dispatch('setToken', null)

			if (isAdminRemoved && isTokenRemoved) resolve(true)
			else reject(new Error('Could not remove admin and token.'))
		})
	},

	setAdmin({ commit }, admin) {
		return new Promise((resolve, reject) => {
			localStorage.setItem('admin', JSON.stringify(admin))
			commit('SET_ADMIN', admin)
			resolve(admin)
		})
	},

	setToken({ commit }, token) {
		return new Promise((resolve, reject) => {
			localStorage.setItem('token', JSON.stringify(token))
			commit('SET_ADMIN_TOKEN', token)
			resolve(token)
		})
	}
}

const getters = {
	getAdmin(state) {
		return state.admin
	},

	getAdminToken(state) {
		return state.token
	},

	isAdminLoggedIn(state) {
		return state.token !== null
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
