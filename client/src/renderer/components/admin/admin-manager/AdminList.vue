<template>
  <div class="admin-list">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="blue right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">Admins</h1>
            <v-btn @click="logoutAdmin" class="logout-btn pink">
              Logout
            </v-btn>
        </div>
      </v-flex>
      <v-flex class="admin-container">
        <!-- Display messages -->
        <div class="error-msg" v-if="error" v-html="error" />
        <div class="success-msg" v-if="success" v-html="success" />

        <!-- List of all admins in the db -->
        <div class="list-of-admins">
          <v-list two-line>
            <v-list-tile
                v-for="admin in this.admins"
                :key="admin._id"
                @click="viewAdmin(admin._id)"
            >

              <v-list-tile-action>
                  <v-icon>gavel</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{admin.username}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{admin.name}}</v-list-tile-sub-title>
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
      admins: [],
      error: null,
      success: null
    }
  },
  async mounted() {
    try {
      // Get Admin list
      const response = (await AdminService.getAllAdmins()).data
      if (response.admins) {
        const admins = this.admins
        const currentLoggedInAdmin = this.$store.state.admin.username
        // Add admin in the admins array
        response.admins.forEach(function(admin) {
          // Don't display the currently logged in admin
          if (admin.username === currentLoggedInAdmin) {
            return false
          } else {
            admins.push(admin)
          }
        })
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
        console.log(error)
        this.success = null
        this.error = error.response.data.error
      }
    },
    viewAdmin(adminId) {
      this.$router.push({name: 'admin-view-admin', params: {adminId}})
    }
  }
}
</script>

<style scoped lang="scss">

  .list-of-admins {
    width: 100%;
  }

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
