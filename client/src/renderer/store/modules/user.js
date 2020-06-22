import AuthService from '../../services/AuthService'
var state = {
	user: JSON.parse(localStorage.getItem('user')),
	token: localStorage.getItem('token') || ''
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
			const jsonUser = user ? JSON.stringify(user) : ''
			localStorage.setItem('user', jsonUser)
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

	clearUser(context) {
		localStorage.removeItem('user')
		context.commit('SET_USER', '')
	},
	clearToken(context) {
		localStorage.removeItem('token')
		context.commit('SET_TOKEN', '')
	},

	// Set all data when user logs in
	async loginUser(context, data) {
		try {
			const res = await AuthService.login(data)

			context.dispatch('setUser', res.data.user)
			context.dispatch('setToken', res.data.token)
			return res
		} catch (err) {
			throw err
		}
	},

	async logoutUser(context) {
		try {
			const res = await AuthService.logout()
			// Remove all user data
			context.dispatch('clearUser')
			context.dispatch('clearToken')
			localStorage.removeItem('user')
			localStorage.removeItem('token')
			return res
		} catch (err) {
			throw err
		}
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
		const t = state.token
		const isLoggedIn = typeof t === 'string' && t.length > 10
		return isLoggedIn
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
