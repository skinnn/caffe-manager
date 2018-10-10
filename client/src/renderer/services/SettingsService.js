import Api from '@/services/Api'

export default {
  getOrCreateAdminSettings(adminId) {
    return Api().get(`admin/${adminId}/settings`)
  },
  updateAdminSettings(adminId, settingsFormData) {
    return Api().put(`admin/${adminId}/settings`, settingsFormData)
  }
}
