import Api from '../services/Api'

export default {
	createRootAdmin() {
		return Api().get('/find/root')
	},
	getAllAdmins() {
		return Api().get('/admin')
	},
	createAdmin(data) {
		return Api().post('/admin', data)
	},
	updateAdmin(admin) {
		return Api().patch(`/admin/${admin.id}`, admin)
	},
	getUserById(userId) {
		return Api().get(`/admin/user/${userId}`)
	},
	deleteAdmin(adminId, imgPath) {
		return Api().delete(`/admin/${adminId}`, {data: { imgPath: imgPath }})
	},
	deleteUser(adminId, userId, imgPath) {
		return Api().delete(`/admin/${adminId}/user/${userId}`, {data: { imgPath: imgPath }})
	}
}
