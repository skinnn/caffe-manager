<template>
  <v-layout row class="mt-5">
    <v-flex xs6 offset-xs3>
      <div class="white elevation-5">
        <v-toolbar class="black toolbar" flat dense>
          <v-toolbar-title class="toolbar-title">Admin Login</v-toolbar-title>
        </v-toolbar>
        <div class="register-page pl-4 pr-4 pb-3 pt-4">
          <!-- <router-link to="/admin/register"><v-btn color="blue">Admin Register</v-btn></router-link> -->
          <router-link to="/admin/login" event=""><v-btn color="blue">Admin Login</v-btn></router-link>
          <router-link to="/admin/landingpage/register"><v-btn color="blue">Admin Register</v-btn></router-link>
          <router-link to="/"><v-btn color="blue">User Login</v-btn></router-link>
          <v-text-field
            type="text"
            v-model="username"
            label="Username:"
            outline
            ></v-text-field>
          <v-text-field
            type="password"
            v-model="password"
            label="Password:"
            outline
            ></v-text-field>
          <!-- Display messages -->
          <div class="error-msg" v-if="error" v-html="error" />
          <div class="success-msg" v-if="success" v-html="success" />
          <br>
          <v-btn class="green login-button"
            block
            @click="loginAdmin">
            Login
          </v-btn>
        </div>

      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import SettingsService from '@/services/SettingsService'

export default {
  data() {
    return {
      username: '',
      password: '',
      error: null,
      success: null
    }
  },
  methods: {
    async loginAdmin() {
      try {
        // Admin Login
        const response = (await AuthenticationService.loginAdmin({
          username: this.username,
          password: this.password
        })).data
        // If Admin login is successfull
        if (response.admin) {
          this.$router.push({
            name: 'admin-home'
          })
          // Set Admin in the Vuex Store
          this.$store.dispatch('setAdmin', response.admin)

          // Get or Create Settings
          const res = (await SettingsService.getOrCreateAdminSettings(response.admin._id)).data
          if (res.settings) {
            // Set Settings in the Vuex Store
            this.$store.dispatch('setSettings', res.settings)
            console.log('Settings State: ', this.$store.state.settings)
          }
        }
      } catch (error) {
        console.log(error)
        this.success = null
        this.error = error.response.data.error
      }
    }
  },
  mounted() {
    // TODO: Fire this only if logout was clicked
    if (!this.$store.state.isAdminLoggedIn) {
      this.success = 'Logged out.'
      setTimeout(() => {
        this.success = null
      }, 3000)
    }
  }
}
</script>

<style scoped lang="scss">

  .toolbar-title {
    color: white;
  }

</style>
