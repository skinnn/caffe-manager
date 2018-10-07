import Api from '@/services/Api'

export default {
  getReservedArticles(sendData) {
    return Api().get(`/admin/${sendData.ownerId}/table/${sendData.currentTableId}/reserved-articles`)
  },
  createOrder(ownerId, currentTableId, order) {
    return Api().post(`/admin/${ownerId}/table/${currentTableId}/order`, order)
  },
  getOrdersByTableId(ownerId, currentTableId) {
    return Api().get(`/admin/${ownerId}/table/${currentTableId}/order`)
  },
  deleteOrder(ownerId, orderId, currentTableId) {
    return Api().delete(`/admin/${ownerId}/table/${currentTableId}/order/${orderId}`)
  },
  reserveArticles(orderData) {
    return Api().post(`/admin/${orderData.ownerId}/table/${orderData.currentTableId}/order/${orderData.orderId}/reserve`, orderData)
  }
}
