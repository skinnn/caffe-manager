import Api from '@/services/Api'

export default {
	login(data) {
		return Api().post('/auth/login', data)
	},
	logout() {
		return Api().delete('/auth/login')
	}
}
