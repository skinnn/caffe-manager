<template>
  <div class="admin-edit">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">
              Create Admin
            </h1>
            <v-btn @click="logoutAdmin" class="logout-btn pink">
              Logout
            </v-btn>
        </div>
      </v-flex>

      <v-flex class="admin-container">

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
          <v-text-field
            type="text"
            v-model="name"
            label="Full name:"
            outline
          ></v-text-field>

          <!-- Display messages -->
          <div class="error-msg" v-if="error" v-html="error" />
          <div class="success-msg" v-if="success" v-html="success" />

          <v-btn @click="registerAdmin()" class="yellow">
            Create
          </v-btn>

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import AuthenticationService from '@/services/AuthenticationService'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      username: '',
      name: '',
      password: '',
      password2: '',
      error: null,
      success: null
    }
  },
  mounted() {

  },
  methods: {
    async registerAdmin() {
      try {
        const response = (await AuthenticationService.registerAdmin({
          username: this.username,
          password: this.password,
          password2: this.password2,
          name: this.name
        })).data
        // If registering was successful redirect to the admin list
        if (response.admin) {
          this.$router.push({
            name: 'admin-register'
          })

          this.success = `Admin with username <span style="color: blue; font-size:17px;">${this.username}</span>
           registered successfully.`
          this.error = ''

          // Set input values after registering to blank
          this.username = ''
          this.password = ''
          this.password2 = ''
          this.name = ''
        }
      } catch (error) {
        console.log(error)
        this.success = ''
        this.error = error.response.data.error
      }
    },
    async logoutAdmin() {
      try {
        const response = (await AuthenticationService.logoutAdmin()).data

        if (response.loggedOutMessage) {
          // Set admin and isLoggedIn states to false
          this.$store.dispatch('setAdmin', null)
          // Redirect to admin login page
          this.$router.push({
            name: 'admin-login'
          })
        }
      } catch (error) {
        this.success = null
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<style scoped lang="scss">

  .list-title {
    font-size: 17px;
  }

  .logout-btn {
    position: relative;
    bottom: 20px;
    left: 70%;
    color: white;
  }

</style>
