import Api from '@/services/Api'

export default {
  createTable(table) {
    return Api().post(`/admin/${table.owner}/table/create`, table)
  },
  getTablesByUserId(userId) {
    return Api().get(``)
  },
  getTableById(articleId, storageId) {
    return Api().get(``)
  },
  saveTable(tableId) {
    return Api().put(``)
  },
  deleteTable(tableId) {
    return Api().delete(``)
  }
}
