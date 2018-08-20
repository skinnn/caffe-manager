<template>
  <div class="user-list">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="blue right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">Staff Members:</h1>
            <v-btn @click="logoutAdmin" class="logout-btn pink">
              Logout
            </v-btn>
        </div>
      </v-flex>

      <v-flex class="admin-container">
        <!-- Display messages -->
        <div class="error-msg" v-if="error" v-html="error" />
        <div class="success-msg" v-if="success" v-html="success" />

        <!-- Should list all the tables by their owners/users -->
        <p>User 1</p>
        <p>User 2</p>
        <p>User 3</p>
        <p>User 4</p>
        <p>User 5</p>
        <p>User 6</p>
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
      error: null,
      success: null
    }
  },
  methods: {
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
        console.log(error)
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
