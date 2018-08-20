import Vue from 'vue'
import Router from 'vue-router'

// User Components
const UserRegister = require('@/components/UserRegister').default
const UserLogin = require('@/components/UserLogin').default
const UserHome = require('@/components/user/UserHome').default
const UserTables = require('@/components/user/UserTables').default
const UserWarehouse = require('@/components/user/UserWarehouse').default

// Admin Components
// const AdminRegister = require('@/components/admin/AdminRegister').default
const AdminLogin = require('@/components/AdminLogin').default
const AdminHome = require('@/components/admin/AdminHome').default
const AdminWarehouse = require('@/components/admin/AdminWarehouse').default
const AdminTables = require('@/components/admin/AdminTables').default
const AdminAdminList = require('@/components/admin/AdminAdminList').default
const AdminUserList = require('@/components/admin/AdminUserList').default
const AdminViewAdmin = require('@/components/admin/AdminViewAdmin').default
const AdminEditAdmin = require('@/components/admin/AdminEditAdmin').default
const AdminEditUser = require('@/components/admin/AdminEditUser').default
const AdminViewUser = require('@/components/admin/AdminViewUser').default
const AdminTaxes = require('@/components/admin/AdminTaxes').default
const AdminCreateAdmin = require('@/components/admin/AdminCreateAdmin').default

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
      component: AdminCreateAdmin
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
    },
    {
      path: '/admin/admin-list',
      name: 'admin-admin-list',
      component: AdminAdminList
    },
    {
      path: '/admin/user-list',
      name: 'admin-user-list',
      component: AdminUserList
    },
    {
      path: '/admin/:adminId',
      name: 'admin-view-admin',
      component: AdminViewAdmin
    },
    {
      path: '/admin/:userId',
      name: 'admin-view-user',
      component: AdminViewUser
    },
    {
      path: '/admin/taxes',
      name: 'admin-taxes',
      component: AdminTaxes
    },
    {
      path: '/admin/:adminId/edit',
      name: 'admin-edit-admin',
      component: AdminEditAdmin
    },
    {
      path: '/admin/user/:userId/edit',
      name: 'admin-edit-user',
      component: AdminEditUser
    }
  ]
})
