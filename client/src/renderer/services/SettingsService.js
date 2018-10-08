import Api from '@/services/Api'

export default {
  getOrCreateAdminSettings(adminId) {
    return Api().get(`admin/${adminId}/settings`)
  }
  // updateSettings(adminId, newSettings) {
  //   return Api().put(`admin/${adminId}`, newSettings)
  // }
}
