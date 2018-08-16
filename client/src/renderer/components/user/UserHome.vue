<template>
  <div class="user-home">
    <div>
      <user-side-menu />
    </div>
      <v-layout column class="blue right-side">
        <v-flex class="yellow">
          <div class="user-header">
              <h1 class="heading">Home</h1>
              <v-btn @click="logoutUser" class="logout-btn pink">
                Logout
              </v-btn>
          </div>
        </v-flex>

        <v-flex class="user-container">
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
import UserSideMenu from '@/components/user/UserSideMenu'
import AuthenticationService from '@/services/AuthenticationService'

export default {
  components: {
    UserSideMenu
  },
  data() {
    return {
      error: null,
      success: null
    }
  },
  methods: {
    async logoutUser() {
      try {
        const response = (await AuthenticationService.logoutUser()).data

        if (response.loggedOutMessage) {
          // Set isLoggedIn state to false
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
</script>

<style scoped>

  .user-header {
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

  .user-container {
    height: 100%;
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
  }

  .logout-link {
    text-decoration: none;
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
