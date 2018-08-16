import Api from '@/services/Api'

export default {
  registerUser(credentials) {
    return Api().post('user/register', credentials)
  },
  registerAdmin(credentials) {
    return Api().post('admin/register', credentials)
  },
  loginUser(credentials) {
    return Api().post('user/login', credentials)
  },
  loginAdmin(credentials) {
    return Api().post('admin/login', credentials)
  },
  logoutUser(credentials) {
    return Api().get('user/logout', credentials)
  }
}

// AuthenticationService.register({
//   email: 'testing@gmail.com',
//   password: '12345678'
// })
