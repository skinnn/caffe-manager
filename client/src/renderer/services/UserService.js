import Api from '@/services/Api'

export default {
	createUser(token, data) {
		return Api(token).post('user', data)
	},

	getLoginList(data) {
		return Api().get(`login-list/${data.role}`)
	},

	getUserById(token, data) {
		return Api(token).get(`user/${data.id}`)
	},

	updateUserById(token, id, data) {
		return Api(token).patch(`user/${id}`, data)
	}
}
