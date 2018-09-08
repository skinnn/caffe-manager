<template>
  <div class="admin-view">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">
              User: {{user.name}}
              <v-btn @click="editUser(user._id)" class="yellow">
                Edit
              </v-btn>
            </h1>
            <v-btn @click="logoutAdmin" class="logout-btn pink">
              Logout
            </v-btn>
        </div>
      </v-flex>

      <v-flex class="admin-container">
        <!-- Display messages -->
        <div class="error-msg" v-if="error" v-html="error" />
        <div class="success-msg" v-if="success" v-html="success" />

        <div class="admin-info">
          <p>Username: {{user.username}}</p>
          <p>ID: {{user._id}}</p>
          <p>Full name: {{user.name}}</p>
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
      user: {},
      error: null,
      success: null
    }
  },
  async mounted() {
    try {
      const userId = this.$store.state.route.params.userId
      const response = (await AdminService.getUserById(userId)).data

      if (response.user) {
        this.user = response.user
      }
    } catch (error) {
      this.success = null
      this.error = error.response.data.error
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
        this.success = null
        this.error = error.response.data.error
      }
    },
    editUser(userId) {
      this.$router.push({name: 'admin-edit-user', params: {userId}})
    }
  }
}
</script>

<style scoped lang="scss">

  .admin-info {
    width: 100%;
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
