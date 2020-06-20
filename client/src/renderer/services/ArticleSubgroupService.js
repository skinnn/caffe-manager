import Api from '../services/Api'

export default {
	createArticleSubgroup(formData, storageId) {
		return Api().post(`/storage/${storageId}/subgroup/create`, formData)
	},
	getSubgroupsFromMainStorages() {
		return Api().get(`/main-storages/subgroups`)
	},
	getSubgroupsByStorageId(storageId) {
		return Api().get(`/storage/${storageId}/subgroups`)
	}
}
