import Api from '@/services/Api'

export default {
	createArticleSubgroup(formData, storageId) {
		return Api().post(`/admin/storage/${storageId}/subgroup/create`, formData)
	},
	getSubgroupsFromMainStorages() {
		return Api().get(`/admin/main-storages/subgroups`)
	},
	getSubgroupsByStorageId(storageId) {
		return Api().get(`/admin/storage/${storageId}/subgroups`)
	}
}
