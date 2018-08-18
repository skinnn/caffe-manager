<template>
  <v-layout row class="mt-5">
    <v-flex xs6 offset-xs3>
      <div class="white elevation-5">
        <v-toolbar class="black toolbar" flat dense>
          <v-toolbar-title class="toolbar-title">Register Admin</v-toolbar-title>
        </v-toolbar>
        <div class="register-page pl-4 pr-4 pb-3 pt-4">
          <router-link to="/admin/register" event=""><v-btn color="blue">Admin Register</v-btn></router-link>
          <router-link to="/admin/login"><v-btn color="blue">Admin Login</v-btn></router-link>
          <router-link to="/user/register"><v-btn color="blue">User Register</v-btn></router-link>
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
            <v-text-field
              type="password"
              v-model="password2"
              label="Confirm Password:"
              outline
              ></v-text-field>
          <!-- Display messages -->
          <div class="error-msg" v-if="error" v-html="error" />
          <div class="succes-msg" v-if="success" v-html="success" />
          <br>
          <v-btn class="green register-button"
            block
            @click="registerAdmin">
            Register
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
      password2: '',
      error: null,
      success: null
    }
  },
  methods: {
    async registerAdmin() {
      try {
        const response = (await AuthenticationService.registerAdmin({
          username: this.username,
          password: this.password,
          password2: this.password2
        })).data
        this.success = `Admin with username <span style="color: blue; font-size:17px;">${this.username}</span>
         registered successfully.`
        this.error = ''
        // If registering was successfull redirect to admin login page
        if (response.admin) {
          this.$router.push({
            name: 'admin-login'
          })
          // console.log(`Admin: ${response.admin.username} has been registered successfully.`)
        }
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

  .toolbar-title {
    color: white;
  }

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

  .highlight-user {
    color: black;
    background-color: red;
  }

  .register-button {
    color: white;
  }

</style>
