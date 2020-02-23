import Api from '@/services/Api'

export default {
	createUser(token, data) {
		return Api(token).post('user', data)
	}
}
