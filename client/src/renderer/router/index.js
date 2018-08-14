import Vue from 'vue'
import Router from 'vue-router'

// Components
const RegisterUser = require('@/components/RegisterUser').default
const Login = require('@/components/Login').default
const AdminHome = require('@/components/admin/Home').default
const RegisterAdmin = require('@/components/admin/RegisterAdmin').default

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'register-user',
      component: RegisterUser
    },
    {
      path: '/register-admin',
      name: 'register-admin',
      component: RegisterAdmin
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin/home',
      name: 'admin-home',
      component: AdminHome
    }
  ]
})
