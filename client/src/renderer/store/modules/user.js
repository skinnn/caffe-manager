var state = {
	user: JSON.parse(localStorage.getItem('user')) || null,
	token: localStorage.getItem('token') || null
}

const mutations = {
	SET_USER(state, user) {
		state.user = user
	},
	SET_TOKEN(state, token) {
		state.token = token
	}
}

const actions = {
	setUser({ commit }, user) {
		return new Promise((resolve, reject) => {
			localStorage.setItem('user', JSON.stringify(user))
			commit('SET_USER', user)
			resolve(user)
		})
	},

	setToken({ commit }, token) {
		return new Promise((resolve, reject) => {
			localStorage.setItem('token', token)
			commit('SET_TOKEN', token)
			resolve(token)
		})
	},

	// Set all data when user logs in
	loginUser(context, data) {
		return new Promise((resolve, reject) => {
			const isUserSet = context.dispatch('setUser', data.user)
			const isTokenSet = context.dispatch('setToken', data.token)

			if (isUserSet && isTokenSet) resolve(data.user, data.token)
			else reject(new Error('Could not set user and token.'))
		})
	},

	logoutUser(context) {
		return new Promise((resolve, reject) => {
			const isUserRemoved = context.dispatch('setUser', null)
			const isTokenRemoved = context.dispatch('setToken', null)

			if (isUserRemoved && isTokenRemoved) resolve(true)
			else reject(new Error('Could not remove user and token.'))
		})
	}
}

const getters = {
	getUser(state) {
		return state.user
	},

	getUserToken(state) {
		return state.token
	},

	isLoggedIn(state) {
		return state.token !== null
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
