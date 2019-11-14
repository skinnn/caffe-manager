/*
  User routes - Needs to be atuhenticated as User to get
  this assets (if in production)
*/


// User components
const UserHome = require('@/components/user/UserHome').default
const UserTables = require('@/components/user/UserTables').default
const UserWarehouse = require('@/components/user/UserWarehouse').default

const routes = [
  {
    path: '/user/home',
    name: 'user-home',
    component: UserHome
  },
  {
    path: '/user/warehouse',
    name: 'user-warehouse',
    component: UserWarehouse
  },
  {
    path: '/user/tables',
    name: 'user-tables',
    component: UserTables
  },
]

export default routes
