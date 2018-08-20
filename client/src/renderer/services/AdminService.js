import Api from '@/services/Api'

export default {
  getAllAdmins() {
    return Api().get('admin/admins')
  },
  getAdminById(adminId) {
    return Api().get(`admin/${adminId}`)
  },
  saveAdmin(admin) {
    return Api().put(`admin/${admin._id}`, admin)
  },
  getAllUsers() {
    return Api().get('admin/users')
  },
  getUserById(userId) {
    return Api().get(`admin/user/${userId}`)
  }
}
