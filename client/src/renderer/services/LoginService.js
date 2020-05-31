import Api from '@/services/Api'

export default {
	login(data) {
		return Api().post('/login', data)
	},
	logout() {
		return Api().delete('/login')
	}
}
