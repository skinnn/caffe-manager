import Api from '@/services/Api'

export default {
	createUser(token, data) {
		return Api(token).post('user', data)
	},

	getUserLoginList() {
		return Api().get('user/login-list')
	},

	getAdminLoginList() {
		return Api().get('admin/login-list')
	}
}
