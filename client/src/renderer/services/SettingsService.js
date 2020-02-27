import Api from '@/services/Api'

export default {
	getOrCreateStoreSettings(token) {
		// return Api(token).get(`admin/${adminId}/settings`)
		return Api(token).get(`store/settings`)
	},
	updateAdminSettings(adminId, settingsFormData) {
		return Api().patch(`admin/${adminId}/settings`, settingsFormData)
	}
}
