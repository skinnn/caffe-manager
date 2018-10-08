import Api from '@/services/Api'

export default {
  getOrCreateAdminSettings(adminId) {
    return Api().get(`admin/${adminId}/settings`)
  },
  createSettings(adminId) {
    return Api().post(`admin/${adminId}/settings`)
  }
}
