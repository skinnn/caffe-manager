import Api from '@/services/Api'

export default {
  getUserLoginPage(credentials) {
    return Api().get('/', credentials)
  },

  getUserHome(credentials) {
    return Api().get('user/home', credentials)
  }
}

// AuthenticationService.register({
//   email: 'testing@gmail.com',
//   password: '12345678'
// })
