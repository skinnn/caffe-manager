/*
	Shared routes - don't need to be atuhenticated to get
	this assets (if in production)
*/

const AdminLogin = require('@/views/AdminLogin').default
const UserLogin = require('@/views/UserLogin').default

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
