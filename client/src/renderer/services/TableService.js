import Api from '@/services/Api'

export default {
  createTable(table) {
    return Api().post(`/admin/${table.owner}/table/create`, table)
  },
  getTablesByOwnerId(ownerId) {
    return Api().get(`/admin/${ownerId}/tables`)
  },
  viewTable(ownerId, tableId) {
    return Api().get(`/admin/${ownerId}/table/${tableId}`)
  },
  // saveTable(tableId) {
  //   return Api().put(``)
  // },
  deleteTable(ownerId, tableId) {
    return Api().delete(`/admin/${ownerId}/table/${tableId}`)
  }
}
