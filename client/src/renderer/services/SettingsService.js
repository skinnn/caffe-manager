import Api from '@/services/Api'

export default {
	getOrCreateStoreSettings() {
		// return Api().get(`admin/${adminId}/settings`)
		return Api().get(`/store/settings`)
	},
	updateAdminSettings(adminId, settingsFormData) {
		return Api().patch(`/admin/${adminId}/settings`, settingsFormData)
	}
}
