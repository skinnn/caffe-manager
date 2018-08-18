<template>
  <div class="admin-home">
    <div>
      <admin-side-menu />
    </div>
      <v-layout column class="blue right-side">
        <v-flex>
          <div class="admin-header">
              <h1 class="heading">Home</h1>
              <v-btn @click="logoutAdmin" class="logout-btn pink">
                Logout
              </v-btn>
          </div>
        </v-flex>

        <v-flex class="admin-container">
          <!-- Display messages -->
          <div class="error-msg" v-if="error" v-html="error" />
          <div class="succes-msg" v-if="success" v-html="success" />

          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
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

        if (response.admin === false) {
          // Set admin and isLoggedIn states to false
          this.$store.dispatch('setAdmin', null)
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

<style scoped>

  .admin-header {
    position: fixed;
    min-height: 100px;
    width: 100%;
    color: white;
    background-color: #3d3d3d;
    border-bottom: 1px solid white;
  }

  .heading {
    position: relative;
    top: 25px;
    left: 6%;
    font-size: 31px;
  }

  .admin-container {
    height: 100%;
    width: 100%;
    margin-left: 5%;
  }

  .right-side {
    margin-left: 18.9%;
    width: 100%;
  }

  .list-title {
    font-size: 17px;
  }

  .logout-btn {
    position: fixed;
    left: 90%;
    top: 6%;
    z-index: 99;
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

</style>
