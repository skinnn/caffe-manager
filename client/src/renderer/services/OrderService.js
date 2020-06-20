import Api from '@/services/Api'

export default {
	getReservedArticles(sendData) {
		return Api().get(`/admin/${sendData.user_id}/table/${sendData.currentTableId}/reserved-articles`)
	},
	createOrder(user_id, currentTableId, order) {
		return Api().post(`/admin/${user_id}/table/${currentTableId}/order`, order)
	},
	getOrdersByTableId(user_id, currentTableId) {
		return Api().get(`/admin/${user_id}/table/${currentTableId}/order`)
	},
	deleteOrder(user_id, orderId, currentTableId) {
		return Api().delete(`/admin/${user_id}/table/${currentTableId}/order/${orderId}`)
	},
	reserveArticles(orderData) {
		return Api().post(`/admin/${orderData.user_id}/table/${orderData.currentTableId}/order/${orderData.orderId}/reserve`, orderData)
	}
}
