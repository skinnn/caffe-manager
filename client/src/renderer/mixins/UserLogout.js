import AuthenticationService from '@/services/AuthenticationService'

export default {
  methods: {
    async logoutUser() {
      try {
        const response = (await AuthenticationService.logoutUser()).data

        if (response.user === false) {
          // Set user and isLoggedIn states to false
          this.$store.dispatch('setUser', null)
          // Redirect to user login page
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
