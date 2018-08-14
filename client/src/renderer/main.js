import Vue from 'vue'
import axios from 'axios'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.http = Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
