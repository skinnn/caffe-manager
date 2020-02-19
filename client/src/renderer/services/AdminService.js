import Api from '@/services/Api'

export default {
	createRootAdmin() {
		return Api().get('find/root')
	},
	getAllAdmins() {
		return Api().get('admin/admins')
	},
	getAdminById(adminId) {
		return Api().get(`admin/${adminId}`)
	},
	saveAdmin(admin) {
		return Api().put(`admin/${admin._id}`, admin)
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
		return Api().put(`admin/user/${userId}`, user)
	},
	deleteAdmin(adminId, imgPath) {
		return Api().delete(`admin/${adminId}`, {data: { imgPath: imgPath }})
	},
	deleteUser(adminId, userId, imgPath) {
		return Api().delete(`admin/${adminId}/user/${userId}`, {data: { imgPath: imgPath }})
	}
}
