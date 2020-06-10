/*
	User routes - Needs to be atuhenticated as User to get this assets
*/
const config = require('../../config/config')

// User components
const UserHome = require('@/views/user/UserHome').default
const UserTables = require('@/views/user/UserTables').default
const UserWarehouse = require('@/views/user/UserWarehouse').default

const routes = [
	// {
	// 	path: '/user/home',
	// 	name: 'user-home',
	// 	component: UserHome,
	// 	meta: {
	// 		title: 'Home'
	// 	}
	// },
	// {
	// 	path: '/user/warehouse',
	// 	name: 'user-warehouse',
	// 	meta: {
	// 		title: 'Warehouse'
	// 	},
	// 	component: UserWarehouse
	// },
	// {
	// 	path: '/user/tables',
	// 	name: 'user-tables',
	// 	meta: {
	// 		title: 'Tables'
	// 	},
	// 	component: UserTables
	// }
]

// Should always be a bool - false, or string - 'user'
let isUserAuthRequired = config.authentication.user ? 'user' : false
if (process.env.NODE_ENV === 'production') isUserAuthRequired = 'user'
// Dynamically append authentication meta for all user routes
routes.map(route => {
	route.meta = {
		...route.meta,
		requiresAuth: isUserAuthRequired
	}
})

export default routes
