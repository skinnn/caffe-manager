<template>
  <v-layout row class="mt-5">
    <v-flex xs6 offset-xs3>
      <div class="white elevation-5">
        <v-toolbar class="black toolbar" flat dense>
          <v-toolbar-title class="toolbar-title">User Login</v-toolbar-title>
        </v-toolbar>
        <div class="register-page pl-4 pr-4 pb-3 pt-4">
          <router-link to="admin/register">Admin Register</router-link>
          <router-link to="admin/login">Admin Login</router-link>
          <router-link to="user/register">User Register</router-link>
          <router-link to="user/login">User Login</router-link>
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
        const response = await AuthenticationService.loginUser({
          username: this.username,
          password: this.password
        })
        if (response.data.user) {
          this.$router.push({
            name: 'user-home'
          })
        }
        console.log(response.data)
      } catch (error) {
        console.log(error)
        this.success = ''
        this.error = error.response.data.error
      }
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
