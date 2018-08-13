import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'register',
      component: require('@/components/Register').default
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/admin/home',
      name: 'admin-home',
      component: require('@/components/admin/Home').default
    }
  ]
})
