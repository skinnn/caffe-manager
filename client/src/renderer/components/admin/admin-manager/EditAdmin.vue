<template>
  <div class="admin-edit">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">
              Edit Admin: {{admin.name}}
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

        <div class="admin-edit">

          <label>Username:</label>
          <v-text-field
            type="text"
            v-model="admin.username"
            outline
          ></v-text-field>

          <label>Full name:</label>
          <v-text-field
            type="text"
            v-model="admin.name"
            outline
          ></v-text-field>

          <v-btn @click="saveAdmin(admin._id)" class="yellow">
            Save
          </v-btn>
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
      admin: {},
      error: null,
      success: null
    }
  },
  async mounted() {
    try {
      const adminId = this.$store.state.route.params.adminId
      const response = (await AdminService.getAdminById(adminId)).data

      if (response.admin) {
        this.admin = response.admin
      }
    } catch (error) {
      this.success = null
      this.error = error.response.data.error
    }
  },
  methods: {
    async saveAdmin(adminId) {
      try {
        // Save Admin
        const response = (await AdminService.saveAdmin(this.admin)).data

        // Set success message and timeout
        this.success = response.success
        setTimeout(() => {
          this.success = null
        }, 3000)
      } catch (error) {
        this.success = null
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
        console.log(error)
        this.success = null
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<style scoped lang="scss">

  .admin-edit {
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
