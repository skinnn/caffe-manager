import Vue from 'vue'
import Router from 'vue-router'

// Components
const UserRegister = require('@/components/UserRegister').default
const AdminRegister = require('@/components/admin/AdminRegister').default
const UserLogin = require('@/components/UserLogin').default
const AdminLogin = require('@/components/AdminLogin').default
const AdminHome = require('@/components/admin/AdminHome').default
const UserHome = require('@/components/user/UserHome').default
const UserTables = require('@/components/user/UserTables').default
const UserWarehouse = require('@/components/user/UserWarehouse').default

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'user-login',
      component: UserLogin
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/admin/register',
      name: 'admin-register',
      component: AdminRegister
    },
    {
      path: '/user/register',
      name: 'user-register',
      component: UserRegister
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLogin
    },
    {
      path: '/admin/home',
      name: 'admin-home',
      component: AdminHome
    },
    {
      path: '/user/home',
      name: 'user-home',
      component: UserHome
    },
    {
      path: '/user/tables',
      name: 'user-tables',
      component: UserTables
    },
    {
      path: '/user/warehouse',
      name: 'user-warehouse',
      component: UserWarehouse
    }
  ]
})
