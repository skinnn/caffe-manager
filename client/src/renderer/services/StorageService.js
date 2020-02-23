import Api from '@/services/Api'

export default {
	createStorage(storage) {
		return Api().post('admin/storage/create', storage)
	},
	getAllStorages() {
		return Api().get('admin/storages')
	},
	getStorageById(storageId) {
		return Api().get(`admin/storage/${storageId}`)
	},
	saveStorage(storage) {
		return Api().patch(`storage/${storage._id}`, storage)
	}
}
