import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',

	modules: modules,

	// Refactor or move to modules
	state: {
		// State for Actve Pages
		activePage: 'home'
	},
	mutations: {
		setActivePage(state, activePage) {
			state.activePage = activePage
		}
	},
	actions: {
		setActivePage({commit}, activePage) {
			commit('setActivePage', activePage)
		}
	}
})
