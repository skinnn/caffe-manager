import Api from '@/services/Api'

export default {
  createArticleSubgroup(storageId, subgroup) {
    return Api().post(`admin/storage/${storageId}/subgroup/create`, subgroup)
  },
  getSubgroupsByStorageId(storageId) {
    return Api().get(`admin/storage/${storageId}/subgroups`)
  }
}
