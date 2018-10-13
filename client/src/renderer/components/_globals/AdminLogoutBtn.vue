<template>
  <v-btn @click="logoutAdmin" class="logout-btn pink">
    Logout
  </v-btn>
</template>

<script>
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
          // Set active page state to false
          this.$store.dispatch('setActivePage', null)

          console.log('App state cleared. ', this.$store.state)

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
</script>

<style scoped lang="scss">

.logout-btn {
  margin-right: 10px;
  position: fixed;
  top: 25px;
  left: 91%;
  color: white;
}

</style>
