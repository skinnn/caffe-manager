/*
  Shared routes - don't need to be atuhenticated to get this assets
*/

const AdminLogin = require('@/components/AdminLogin').default
const UserLogin = require('@/components/UserLogin').default

const routes = [
  {
    path: '/',
    name: 'user-login',
    component: UserLogin
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: AdminLogin
  },
  {
    path: '*',
    redirect: '/'
  }
]

export default routes
