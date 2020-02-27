import Api from '@/services/Api'

export default {
	login(data) {
		return Api().post('login', data)
	},
	logout(token) {
		return Api(token).post('logout')
	}
	// registerUser(data) {
	// 	return Api().post('user/register', data)
	// }
}
