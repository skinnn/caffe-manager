import Vue from 'vue'
import Router from 'vue-router'

// User Components
const UserRegister = require('@/components/UserRegister').default
const UserLogin = require('@/components/UserLogin').default
const UserHome = require('@/components/user/UserHome').default
const UserTables = require('@/components/user/UserTables').default
const UserWarehouse = require('@/components/user/UserWarehouse').default

// Admin Components
const AdminRegister = require('@/components/admin/AdminRegister').default
const AdminLogin = require('@/components/AdminLogin').default
const AdminHome = require('@/components/admin/AdminHome').default
const AdminWarehouse = require('@/components/admin/AdminWarehouse').default
const AdminTables = require('@/components/admin/AdminTables').default

Vue.use(Router)

export default new Router({
  routes: [
    // User Routes
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
      path: '/user/register',
      name: 'user-register',
      component: UserRegister
    },
    {
      path: '/user/warehouse',
      name: 'user-warehouse',
      component: UserWarehouse
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
    // Admin Routes
    {
      path: '/admin/register',
      name: 'admin-register',
      component: AdminRegister
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
      path: '/admin/warehouse',
      name: 'admin-warehouse',
      component: AdminWarehouse
    },
    {
      path: '/admin/tables',
      name: 'admin-tables',
      component: AdminTables
    }
  ]
})
