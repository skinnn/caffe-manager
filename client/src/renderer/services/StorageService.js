import Api from '../services/Api'

export default {
	createStorage(storage) {
		return Api().post('/storage', storage)
	},
	getAllStorages() {
		return Api().get('/storage')
	},
	getStorageById(id) {
		return Api().get(`/storage/${id}`)
	},
	updateStorage(id, storage) {
		return Api().patch(`/storage/${id}`, storage)
	}
}
