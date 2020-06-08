/*
	Shared routes - don't need to be authenticated to get this assets
*/

import Login from '@/views/shared/Login'

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
