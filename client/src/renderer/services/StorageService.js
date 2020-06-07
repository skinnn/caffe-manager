import Api from '@/services/Api'

export default {
	createStorage(storage) {
		return Api().post('/storage', storage)
	},
	getAllStorages() {
		return Api().get('/storage')
	},
	getStorageById(storageId) {
		return Api().get(`/storage/${storageId}`)
	},
	saveStorage(storage) {
		return Api().patch(`/storage/${storage._id}`, storage)
	}
}
