import Api from '@/services/Api'

export default {
  registerUser(credentials) {
    return Api().post('register-user', credentials)
  },
  registerAdmin(credentials) {
    return Api().post('register-admin', credentials)
  },
  loginUser(credentials) {
    return Api().post('login', credentials)
  },
  loginAdmin(credentials) {
    return Api().post('login', credentials)
  }
}

// AuthenticationService.register({
//   email: 'testing@gmail.com',
//   password: '12345678'
// })
