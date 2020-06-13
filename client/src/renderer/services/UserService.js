import Api from '@/services/Api'

export default {
	createUser(data) {
		return Api().post('/user', data)
	},
	uploadUserAttachment(userId, identifier, data) {
		return Api().post(`/user/${userId}/attachment?identifier=${identifier}`, data)
	},
	getLoginList(data) {
		return Api().get(`/user/login-list?role=${data.role}`)
	},
	getUserById(id) {
		return Api().get(`/user/${id}`)
	},
	getAllUsers() {
		return Api().get('/user')
	},
	updateUserById(id, data) {
		return Api().patch(`/user/${id}`, data)
	},
	deleteUserById(id, imgPath) {
		return Api().delete(`/user/${id}`, imgPath)
	}
}
