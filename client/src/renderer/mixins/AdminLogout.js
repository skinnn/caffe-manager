import AuthenticationService from '@/services/AuthenticationService'

export default {
  methods: {
    async logoutAdmin() {
      try {
        const response = (await AuthenticationService.logoutAdmin()).data

        if (response.admin === false) {
          // Set admin and isLoggedIn states to false
          this.$store.dispatch('setAdmin', null)
          // Set settings state to null
          this.$store.dispatch('setSettings', null)

          // Redirect to admin login page
          this.$router.push({
            name: 'user-login'
          })
        }
      } catch (error) {
        console.log(error)
        this.success = null
        this.error = error.response.data.error
      }
    }
  }
}
