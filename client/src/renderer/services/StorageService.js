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
	saveStorage(storage) {
		return Api().patch(`/storage/${storage.id}`, storage)
	}
}
