import Api from '@/services/Api'

export default {
  createArticleSubgroup(storageId, subgroup) {
    return Api().post(`admin/storage/${storageId}/subgroup/create`, subgroup)
  },
  getSubgroupsFromMainStorages() {
    return Api().get(`admin/main-storages/subgroups`)
  },
  getSubgroupsByStorageId(storageId) {
    return Api().get(`admin/storage/${storageId}/subgroups`)
  }
}
