import Api from '@/services/Api'

export default {
	getOrCreateAdminSettings(adminId) {
		return Api().get(`admin/${adminId}/settings`)
	},
	updateAdminSettings(adminId, settingsFormData) {
		return Api().patch(`admin/${adminId}/settings`, settingsFormData)
	}
}
