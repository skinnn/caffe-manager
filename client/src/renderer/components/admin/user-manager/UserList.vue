<template>
  <div class="user-list">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
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

        <!-- TODO: Replace User List with v-data-table, same like Admin List -->
        <!-- TODO: Add animation for fetching/displaying Users possibly with Scroll Reveal -->
        <!-- List of all Users/Staff in the db -->
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
// Components
import AdminSideMenu from '@/components/admin/AdminSideMenu'
// Services
import AdminService from '@/services/AdminService'
// Global Mixins
import AdminLogout from '@/mixins/AdminLogout'

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
    viewUser(userId) {
      this.$router.push({name: 'admin-view-user', params: {userId}})
    }
  },
  mixins: [
    AdminLogout
  ]
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
    margin-right: 10px;
    position: fixed;
    top: 25px;
    left: 91%;
    color: white;
  }

</style>
