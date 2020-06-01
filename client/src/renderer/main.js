import Vue from 'vue'
import App from './App'

// Global mixnins
import '@/_mixins/index.js'

// TODO: Move to plugins directory
// Plugins
import 'material-design-icons/iconfont/material-icons.css'
import axios from 'axios'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import router from './router'
import store from './store/index'
import { sync } from 'vuex-router-sync'

// Global Components
import AdminLogoutBtn from '@/components/_globals/AdminLogoutBtn'
import UserLogoutBtn from '@/components/_globals/UserLogoutBtn'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.http = Vue.prototype.$http = axios

// Register Global Components
Vue.component('adminLogoutBtn', AdminLogoutBtn)
Vue.component('userLogoutBtn', UserLogoutBtn)

// Sync store and router
sync(store, router)

/* eslint-disable no-new */
new Vue({
	components: { App },
	router,
	store,
	template: '<App/>'
}).$mount('#app')
