import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',

  // Initial application state
  state: {
    user: null,
    admin: null,
    isUserLoggedIn: false,
    isAdminLoggedIn: false,
    settings: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      if (user) {
        state.isUserLoggedIn = true
      } else {
        state.isUserLoggedIn = false
      }
    },
    setAdmin(state, admin) {
      state.admin = admin
      if (admin) {
        state.isAdminLoggedIn = true
      } else {
        state.isAdminLoggedIn = false
      }
    },
    setSettings(state, settings) {
      state.settings = settings
    }
  },
  actions: {
    setUser({commit}, user) {
      commit('setUser', user)
    },
    setAdmin({commit}, admin) {
      commit('setAdmin', admin)
    },
    setSettings({commit}, settings) {
      commit('setSettings', settings)
    }
  }
})
