import Api from '@/services/Api'

export default {
	createTable(table) {
		return Api().post(`/admin/${table.owner}/table/create`, table)
	},
	getTablesByuser_id(user_id) {
		return Api().get(`/admin/${user_id}/tables`)
	},
	getTable(user_id, currentTableId) {
		return Api().get(`/admin/${user_id}/table/${currentTableId}`)
	},
	deleteTable(user_id, tableId) {
		return Api().delete(`/admin/${user_id}/table/${tableId}`)
	}
}
