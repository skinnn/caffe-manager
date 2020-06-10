import Api from '@/services/Api'

export default {
	createStore() {
		return Api().get('/store')
	},
	getStoreSettings() {
		return Api().get(`/store`)
	},
	updateStore(id, data) {
		return Api().get(`/store/${id}`, data)
	}
}
