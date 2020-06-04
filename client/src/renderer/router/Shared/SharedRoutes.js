/*
	Shared routes - don't need to be authenticated to get
	this assets (in production)
*/

const Login = require('@/views/shared/Login').default
// TODO: Delete AdminLandingRegister page for production
const AdminLandingRegister = require('@/views/shared/AdminLandingRegister').default

const routes = [
	{
		path: '/',
		name: 'login',
		component: Login
	},
	{
		path: '*',
		redirect: '/'
	}
]

export default routes
