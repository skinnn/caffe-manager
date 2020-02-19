const state = {
	admin: localStorage.getItem('admin') || null,
	token: localStorage.getItem('token') || null,
	isAdminLoggedIn: false
}

const mutations = {
	SET_ADMIN(state, admin, resolve, reject) {
		state.admin = admin
		if (admin) {
			state.isAdminLoggedIn = true
		} else {
			state.isAdminLoggedIn = false
		}
	},
	SET_ADMIN_TOKEN(state, token) {
		state.token = token
	}
}

const actions = {
	// Set all data when admin logs in
	loginAdmin(context, admin, token) {
		return new Promise(function(resolve, reject) {
			const isAdminSet = context.dispatch('setAdmin', admin)
			const isTokenSet = context.dispatch('setToken', token)

			if (isAdminSet && isTokenSet) resolve(admin)
			else reject(new Error('Could not set admin and token.'))
		})
	},

	setAdmin({ commit }, admin) {
		return new Promise((resolve, reject) => {
			localStorage.setItem('admin', admin)
			commit('SET_ADMIN', admin)
			resolve(admin)
		})
	},

	setToken({ commit }, token) {
		return new Promise((resolve, reject) => {
			localStorage.setItem('token', token)
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
