import Api from '@/services/Api'

export default {
	createRootAdmin() {
		return Api().get('find/root')
	},
	getAllAdmins(token) {
		return Api(token).get('admin')
	},
	getAdminById(adminId) {
		return Api().get(`admin/${adminId}`)
	},
	createAdmin(token, data) {
		return Api(token).post('admin', data)
	},
	updateAdmin(admin) {
		return Api().patch(`admin/${admin._id}`, admin)
	},
	getAllUsers() {
		return Api().get('admin/users')
	},
	getUserLoginList() {
		return Api().get('user/login-list')
	},
	getAdminLoginList() {
		return Api().get('admin/login-list')
	},
	getUserById(userId) {
		return Api().get(`admin/user/${userId}`)
	},
	updateUser(userId, user) {
		return Api().patch(`admin/user/${userId}`, user)
	},
	deleteAdmin(adminId, imgPath) {
		return Api().delete(`admin/${adminId}`, {data: { imgPath: imgPath }})
	},
	deleteUser(adminId, userId, imgPath) {
		return Api().delete(`admin/${adminId}/user/${userId}`, {data: { imgPath: imgPath }})
	}
}
