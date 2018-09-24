import Api from '@/services/Api'

export default {
  createOrder(ownerId, currentTableId, order) {
    return Api().post(`/admin/${ownerId}/table/${currentTableId}/order`, order)
  },
  getOrdersByTableId(ownerId, currentTableId) {
    return Api().get(`/admin/${ownerId}/table/${currentTableId}/order`)
  }
}
