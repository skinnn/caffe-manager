import Api from '../services/Api'

export default {
	createUser(data) {
		return Api().post('/user', data)
	},
	getLoginList() {
		return Api().get(`/user/login-list`)
	},
	getUserById(id, query = '') {
		return Api().get(`/user/${id}${query}`)
	},
	getAllUsers(query = '') {
		return Api().get(`/user${query}`)
	},
	updateUserById(id, data, query = '') {
		return Api().patch(`/user/${id}${query}`, data)
	},
	deleteUserById(id) {
		return Api().delete(`/user/${id}`)
	},

	// Attachments
	uploadUserAttachment(userId, identifier, data) {
		return Api().post(`/user/${userId}/attachment?identifier=${identifier}`, data)
	},
	getUserAttachment(userId, identifier) {
		const options = { responseType: 'blob' }
		return Api().get(`/user/${userId}/attachment?match[identifier]=${identifier}`, options)
	}
}
