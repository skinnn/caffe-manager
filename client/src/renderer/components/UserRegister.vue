<template>
  <v-layout row class="mt-5">
    <v-flex xs6 offset-xs3>
      <div class="white elevation-5">
        <v-toolbar class="black toolbar" flat dense>
          <v-toolbar-title class="toolbar-title">Register User</v-toolbar-title>
        </v-toolbar>
        <div class="register-page pl-4 pr-4 pb-3 pt-4">
          <router-link to="/admin/register">Admin Register</router-link>
          <router-link to="/admin/login">Admin Login</router-link>
          <router-link to="/user/register" event="">User Register</router-link>
          <router-link to="/">User Login</router-link>
          <form name="register-user-form" autocomplete="off">
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
              autocomplete="new-password"
            ></v-text-field>
            <v-text-field
              type="password"
              v-model="password2"
              label="Confirm Password:"
              outline
            ></v-text-field>
            <h3 class="mt-4">Permissions</h3>
            <v-checkbox
              :label="`Warehouse - ${userMenu.warehouse.toString()}`"
              v-model="userMenu.warehouse"
            ></v-checkbox>
            <v-checkbox
              :label="`Tables - ${userMenu.tables.toString()}`"
              v-model="userMenu.tables"
            ></v-checkbox>
          </form>
          <!-- Display messages -->
          <div class="error-msg" v-if="error" v-html="error" />
          <div class="succes-msg" v-if="success" v-html="success" />
          <br>
          <v-btn class="green register-button"
            block
            @click="registerUser">
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
      success: null,
      userMenu: {
        warehouse: false,
        tables: false
      }
    }
  },
  methods: {
    async registerUser() {
      try {
        const response = (await AuthenticationService.registerUser({
          username: this.username,
          password: this.password,
          password2: this.password2,
          userMenu: {
            warehouse: this.userMenu.warehouse,
            tables: this.userMenu.tables
          }
        })).data
        this.success = `User <span style="color: blue; font-size:17px;">${this.username}</span>
         registered successfully.`
        this.error = ''
        if (response.user) {
          this.$router.push({
            name: 'user-login'
          })
          console.log(`User: ${response.user.username} has been registered successfully.`)
        }
      } catch (error) {
        console.log(error)
        this.success = ''
        this.error = error.response.error
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
