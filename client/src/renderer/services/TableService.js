import Api from '@/services/Api'

export default {
	createTable(table) {
		return Api().post(`/admin/${table.owner}/table/create`, table)
	},
	getTablesByOwnerId(ownerId) {
		return Api().get(`/admin/${ownerId}/tables`)
	},
	getTable(ownerId, currentTableId) {
		return Api().get(`/admin/${ownerId}/table/${currentTableId}`)
	},
	// saveTable(tableId) {
	//   return Api().patch(``)
	// },
	deleteTable(ownerId, tableId) {
		return Api().delete(`/admin/${ownerId}/table/${tableId}`)
	}
}
