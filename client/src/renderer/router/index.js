// import Vue from 'vue'
// import Router from 'vue-router'

// // User Components
// const UserLogin = require('@/components/UserLogin').default
// const UserHome = require('@/components/user/UserHome').default
// const UserTables = require('@/components/user/UserTables').default
// const UserWarehouse = require('@/components/user/UserWarehouse').default
// // Admin Components
// // TODO: Delete AdminLandingRegister page for production
// const AdminLandingRegister = require('@/components/AdminLandingRegister').default
// const AdminLogin = require('@/components/AdminLogin').default
// const AdminHome = require('@/components/admin/AdminHome').default
// const AdminTaxes = require('@/components/admin/AdminTaxes').default
// // Settings
// const Settings = require('@/components/admin/settings/Settings').default
// const EditSettings = require('@/components/admin/settings/EditSettings').default
// // Storage-Manager
// const AdminViewSubgroup = require('@/components/admin/storage-manager/ViewArticleSubgroup').default
// const AdminEditStorage = require('@/components/admin/storage-manager/EditStorage').default
// const AdminStorageList = require('@/components/admin/storage-manager/StorageList').default
// const AdminArticleSubgroupList = require('@/components/admin/storage-manager/ArticleSubgroupList').default
// const AdminCreateStorage = require('@/components/admin/storage-manager/CreateStorage').default
// const AdminCreateArticle = require('@/components/admin/storage-manager/CreateArticle').default
// const AdminEditArticle = require('@/components/admin/storage-manager/EditArticle').default
// // Table-Manager
// const AdminCurrentTable = require('@/components/admin/table-manager/AdminCurrentTable').default
// const AdminTableList = require('@/components/admin/table-manager/AdminTableList').default
// // Admin-Manager
// const AdminCreateAdmin = require('@/components/admin/admin-manager/CreateAdmin').default
// const AdminViewAdmin = require('@/components/admin/admin-manager/ViewAdmin').default
// const AdminEditAdmin = require('@/components/admin/admin-manager/EditAdmin').default
// const AdminAdminList = require('@/components/admin/admin-manager/AdminList').default
// // User-Manager
// const AdminCreateUser = require('@/components/admin/user-manager/CreateUser').default
// const AdminUserList = require('@/components/admin/user-manager/UserList').default
// const AdminEditUser = require('@/components/admin/user-manager/EditUser').default
// const AdminViewUser = require('@/components/admin/user-manager/ViewUser').default

// Vue.use(Router)

// export default new Router({
//   routes: [
//     // User Routes
//     {
//       path: '/',
//       name: 'user-login',
//       component: UserLogin
//     },
//     {
//       path: '*',
//       redirect: '/'
//     },
//     {
//       path: '/admin/user/create',
//       name: 'admin-create-user',
//       component: AdminCreateUser
//     },
//     {
//       path: '/admin/landingpage/register',
//       name: 'landing-admin-register',
//       component: AdminLandingRegister
//     },
//     {
//       path: '/user/warehouse',
//       name: 'user-warehouse',
//       component: UserWarehouse
//     },
//     {
//       path: '/user/home',
//       name: 'user-home',
//       component: UserHome
//     },
//     {
//       path: '/user/tables',
//       name: 'user-tables',
//       component: UserTables
//     },
//     // Admin Routes
//     {
//       path: '/admin/register',
//       name: 'admin-register',
//       component: AdminCreateAdmin
//     },
//     {
//       path: '/admin/login',
//       name: 'admin-login',
//       component: AdminLogin
//     },
//     {
//       path: '/admin/home',
//       name: 'admin-home',
//       component: AdminHome
//     },
//     {
//       path: '/admin/settings',
//       name: 'admin-settings',
//       component: Settings
//     },
//     {
//       path: '/admin/settings/edit',
//       name: 'admin-edit-settings',
//       component: EditSettings
//     },
//     {
//       path: '/admin/tables',
//       name: 'admin-table-list',
//       component: AdminTableList
//     },
//     {
//       path: '/admin/table/:tableId',
//       name: 'admin-current-table',
//       component: AdminCurrentTable
//     },
//     {
//       path: '/admin/admin-list',
//       name: 'admin-admin-list',
//       component: AdminAdminList
//     },
//     {
//       path: '/admin/user-list',
//       name: 'admin-user-list',
//       component: AdminUserList
//     },
//     {
//       path: '/admin/:adminId',
//       name: 'admin-view-admin',
//       component: AdminViewAdmin
//     },
//     {
//       path: '/admin/:userId',
//       name: 'admin-view-user',
//       component: AdminViewUser
//     },
//     {
//       path: '/admin/taxes',
//       name: 'admin-taxes',
//       component: AdminTaxes
//     },
//     {
//       path: '/admin/:adminId/edit',
//       name: 'admin-edit-admin',
//       component: AdminEditAdmin
//     },
//     {
//       path: '/admin/user/:userId/edit',
//       name: 'admin-edit-user',
//       component: AdminEditUser
//     },
//     {
//       path: '/admin/storage-list',
//       name: 'admin-storage-list',
//       component: AdminStorageList
//     },
//     {
//       path: '/admin/storage/:storageId/subgroup-list',
//       name: 'admin-storage-subgroup-list',
//       component: AdminArticleSubgroupList
//     },
//     {
//       path: '/admin/storage/create',
//       name: 'admin-create-storage',
//       component: AdminCreateStorage
//     },
//     {
//       path: '/admin/storage/:storageId',
//       name: 'admin-view-article-subgroups',
//       component: AdminViewSubgroup
//     },
//     {
//       path: '/admin/storage/:storageId/edit',
//       name: 'admin-edit-storage',
//       component: AdminEditStorage
//     },
//     {
//       path: '/admin/storage/:storageId/article/create',
//       name: 'admin-create-article',
//       component: AdminCreateArticle
//     },
//     {
//       path: '/admin/article/:articleId/edit',
//       name: 'admin-edit-article',
//       component: AdminEditArticle
//     }
//   ]
// })

/* TODO: Split routes in separate folders and files */

import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '@/store'
// import config from '@/config/config'
// Routes
import SharedRoutes from '@/router/Shared/SharedRoutes'
import AdminRoutes from '@/router/Admin/AdminRoutes'

Vue.use(VueRouter)

// Assemble all routes
var allRoutes = []
allRoutes = allRoutes.concat(SharedRoutes, AdminRoutes)
const routes = allRoutes

var Router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

// Route Guard - working only in production mode
// if (config.NODE_ENV === 'production') {
//   Router.beforeEach((to, from, next) => {
//     if (to.matched.some(record => record.meta.requiresLogin)) {
//       // Can use store variable here to access globalError or commit mutation for example
//       console.log('Store state - isAdminLoggedIn:', store.state.isAdminLoggedIn)
//       if (store.state.isAdminLoggedIn) {
//         return next()
//       } else {
//         return next('/admin/login')
//       }
//     } else {
//       return next()
//     }
//   })
// }

export default Router
