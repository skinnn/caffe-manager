/*
	Shared routes - don't need to be atuhenticated to get
	this assets (if in production)
*/

const AdminLogin = require('@/views/shared/AdminLogin').default
const UserLogin = require('@/views/shared/UserLogin').default
// TODO: Delete AdminLandingRegister page for production
const AdminLandingRegister = require('@/views/shared/AdminLandingRegister').default

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
		path: '/admin/landingpage/register',
		name: 'landing-admin-register',
		component: AdminLandingRegister
	},
	{
		path: '*',
		redirect: '/'
	}
]

export default routes
