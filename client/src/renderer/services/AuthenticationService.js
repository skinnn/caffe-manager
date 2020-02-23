import Api from '@/services/Api'

export default {
	login(data) {
		return Api().post('login', data)
	},
	logout(token) {
		return Api(token).post('logout')
	}
	// registerUser(data) {
	// 	return Api().post('user/register', data)
	// },
	// registerAdmin(data) {
	// 	return Api().post('admin/register', data)
	// },
	// loginUser(credentials) {
	// 	return Api().post('user/login', credentials)
	// },
	// loginAdmin(credentials) {
	// 	return Api().post('admin/login', credentials)
	// },
	// logoutUser(credentials) {
	// 	return Api().get('user/logout', credentials)
	// }
}
