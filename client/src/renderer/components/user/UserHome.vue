<template>
  <div class="user-home">
    <div>
      <user-side-menu />
    </div>
      <v-layout column class="blue right-side">
        <v-flex>
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
          <div class="success-msg" v-if="success" v-html="success" />

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

        if (response.user === false) {
          // Set user and isLoggedIn states to false
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

<style scoped lang="scss">

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

  .list-title {
    font-size: 17px;
  }

  .logout-btn {
    margin-right: 10px;
    position: fixed;
    top: 25px;
    left: 91%;
    color: white;
  }

</style>
