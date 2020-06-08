import Vue from 'vue'
import App from './App'

// Global mixnins
import './_mixins/index.js'

// TODO: Move to /plugins directory
// Plugins
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'material-design-icons/iconfont/material-icons.css'
import axios from 'axios'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'

// Global Components
// import AdminLogoutBtn from '@/components/_globals/AdminLogoutBtn'
import LogoutBtn from '@/components/_globals/LogoutBtn'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.http = Vue.prototype.$http = axios

// Global Components
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('LogoutBtn', LogoutBtn)

// Sync store and router
sync(store, router)

/* eslint-disable no-new */
new Vue({
	components: { App },
	router,
	store,
	template: '<App/>'
}).$mount('#app')
