<template>
  <div class="user-list">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="blue right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">Staff Members</h1>
            <v-btn @click="logoutAdmin" class="logout-btn pink">
              Logout
            </v-btn>
        </div>
      </v-flex>

      <v-flex class="admin-container">
        <!-- Display messages -->
        <div class="error-msg" v-if="error" v-html="error" />
        <div class="success-msg" v-if="success" v-html="success" />

        <!-- List of all users in the db -->
        <div class="list-of-users">
          <v-list two-line>
            <v-list-tile
                v-for="user in this.users"
                :key="user._id"
                @click="viewUser(user._id)"
            >

              <v-list-tile-action>
                  <v-icon>people</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{user.username}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{user.name}}</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </div>

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import AuthenticationService from '@/services/AuthenticationService'
import AdminService from '@/services/AdminService'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      users: [],
      error: null,
      success: null
    }
  },
  async mounted() {
    try {
      const response = (await AdminService.getAllUsers()).data

      // Get User list
      if (response.users) {
        const users = this.users
        // Add user in the users array
        response.users.forEach(function(user) {
          users.push(user)
        })
      }
    } catch (error) {
      this.success = null
      this.error = error.response.data.error
      console.log(error)
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
    },
    viewUser(userId) {
      this.$router.push({name: 'admin-view-user', params: {userId}})
    }
  }
}
</script>

<style scoped lang="scss">

  .list-title {
    font-size: 17px;
  }

  .list-of-users {
    width: 100%;
  }

  .logout-btn {
    position: relative;
    bottom: 20px;
    left: 70%;
    color: white;
  }

</style>
