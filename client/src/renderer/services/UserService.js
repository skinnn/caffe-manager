import Api from '@/services/Api'

export default {
	createUser(token, data) {
		return Api(token).post('user', data)
	},

	createUserAttachment(token, userId, identifier, data) {
		return Api(token).post(`user/${userId}/attachment?identifier=${identifier}`, data)
	},

	getLoginList(data) {
		return Api().get(`login-list/${data.role}`)
	},

	getUserById(token, data) {
		return Api(token).get(`user/${data.id}`)
	},

	getAllUsers(token) {
		return Api(token).get('user')
	},

	updateUserById(token, id, data) {
		return Api(token).patch(`user/${id}`, data)
	},

	deleteUserById(token, id, imgPath) {
		return Api(token).delete(`user/${id}`, imgPath)
	}
}
