import Api from '@/services/Api'

export default {
  getOrCreateRootAdmin() {
    return Api().get('find/root')
  },
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
  },
  saveUser(user) {
    return Api().put(`admin/user/${user._id}`, user)
  },
  deleteAdmin(adminId, imgPath) {
    return Api().delete(`admin/${adminId}`, {data: { imgPath: imgPath }})
  },
  deleteUser(userId, imgPath) {
    return Api().delete(`admin/user/${userId}`, {data: { imgPath: imgPath }})
  }
}
