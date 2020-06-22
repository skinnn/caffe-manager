import Api from '../services/Api'

export default {
	createStorage(storage) {
		return Api().post('/storage', storage)
	},
	getAllStorages() {
		return Api().get('/storage')
	},
	getStorageById(id, query = '') {
		return Api().get(`/storage/${id}${query}`)
	},
	updateStorage(id, storage, query = '') {
		return Api().patch(`/storage/${id}${query}`, storage)
	}
}
