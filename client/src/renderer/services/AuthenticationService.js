import Api from '@/services/Api'

export default {
	registerUser(userFormData) {
		return Api().post('user/register', userFormData)
	},
	registerAdmin(adminFormData) {
		return Api().post('admin/register', adminFormData)
	},
	// loginUser(credentials) {
	// 	return Api().post('user/login', credentials)
	// },
	// loginAdmin(credentials) {
	// 	return Api().post('admin/login', credentials)
	// },
	login(data) {
		return Api().post('login', data)
	},
	// logoutUser(credentials) {
	// 	return Api().get('user/logout', credentials)
	// },
	logout(token) {
		return Api(token).post('logout')
	}
}
