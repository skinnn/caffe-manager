<template>
  <v-layout row class="mt-5">
    <v-flex xs6 offset-xs3>
      <div class="white elevation-5">
        <v-toolbar class="black toolbar" flat dense>
          <v-toolbar-title class="toolbar-title">User Login</v-toolbar-title>
        </v-toolbar>
        <div class="register-page pl-4 pr-4 pb-3 pt-4">
          <router-link to="/admin/register"><v-btn color="blue">Admin Register</v-btn></router-link>
          <router-link to="/admin/login"><v-btn color="blue">Admin Login</v-btn></router-link>
          <router-link to="/user/register"><v-btn color="blue">User Register</v-btn></router-link>
          <router-link to="/" event=""><v-btn color="blue">User Login</v-btn></router-link>
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
          <div class="succes-msg" v-if="success" v-html="success" />
          <br>
          <v-btn class="green login-button"
            block
            @click="loginUser">
            Login
          </v-btn>
        </div>

      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

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
    async loginUser() {
      try {
        const response = (await AuthenticationService.loginUser({
          username: this.username,
          password: this.password
        })).data
        // Navigate to user home page
        if (response.user) {
          this.$router.push({
            name: 'user-home'
          })
          // Set user in the vuex store
          this.$store.dispatch('setUser', response.user)
        }

        console.log('Login successfull: ', response.user.username)
      } catch (error) {
        console.log(error)
        this.success = null
        this.error = error.response.data.error
      }
    }
  },
  async mounted() {
    // TODO: Fire this only if user is logged in
    if (!this.$store.state.isUserLoggedIn) {
      this.success = 'You are logged out.'
      setTimeout(() => {
        this.success = null
      }, 3000)
    }
  }
}
</script>

<style scoped>

  .error-msg {
    background-color: pink;
    color: red;
    border-radius: 5px;
    padding: 7px;
    text-align: center;
    font-size: 15px;
  }

  .succes-msg {
    background-color: #b2ffb2;
    color: green;
    border-radius: 5px;
    padding: 7px;
    text-align: center;
    font-size: 15px;
  }

  .toolbar-title {
    color: white;
  }

</style>
