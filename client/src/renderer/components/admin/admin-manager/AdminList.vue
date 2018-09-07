<template>
  <div class="admin-list">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
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

        <!-- TODO: Add animation for fetching/displaying admins -->
        <!-- List of all admins in the db -->
        <div class="list-of-admins">

          <v-data-table
            :headers="headers"
            :items="admins"
            hide-actions
            class="elevation-1"
            dark
          >
            <template slot="items" slot-scope="props">
              <td class="td text-xs-left">
                <img class="admin-image" v-if="props.item.image" :src="`http://localhost:8080/${props.item.image}`" />
              </td>
              <td class="td text-xs-left">
                <span class="admin-name">
                  {{ props.item.name }}
                </span>
              </td>
              <td class="td text-xs-left">
                <span class="admin-username">
                  {{ props.item.username }}
                </span>
              </td>
              <td class="td text-xs-center">
                <v-btn @click="editAdminPage(props.item._id)" class="edit-btn yellow">Edit</v-btn>
                <v-btn @click="deleteAdmin(props.item)" class="delete-btn white">Delete</v-btn>
              </td>
            </template>
          </v-data-table>

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
      headers: [
        {
          text: 'Image',
          align: 'left',
          sortable: false,
          value: 'image'
        },
        {
          text: 'Name', align: 'left', sortable: true, value: 'name'},
        { text: 'Username', sortable: true, value: 'username' },
        { text: 'Options', sortable: false, align: 'center', value: 'option' }
      ],
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
    editAdminPage(adminId) {
      this.$router.push({
        name: 'admin-edit-admin',
        params: {adminId}
      })
    },
    async deleteAdmin(admin) {
      let confirmation = confirm(
        'Are you sure?'
      )
      if (confirmation) {
        try {
          const adminId = admin._id
          const imgPath = admin.image
          const response = (await AdminService.deleteAdmin(adminId, imgPath)).data
          // If Admin is deleted successfully
          if (response.deleted) {
            // Set success message and timeout
            this.error = null
            this.success = response.success
            setTimeout(() => {
              this.success = null
            }, 3000)

            // Reset User list after deleting
            const ress = (await AdminService.getAllAdmins()).data
            if (ress.admins) {
              this.admins = []
              const admins = this.admins
              const currentLoggedInAdmin = this.$store.state.admin.username
              ress.admins.forEach(function(admin) {
                // Don't display the currently logged in admin
                if (admin.username === currentLoggedInAdmin) {
                  return false
                } else {
                  admins.push(admin)
                }
              })
            }
          }
        } catch (error) {
          this.success = null
          this.error = error.response.data.error
        }
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

    .td {
      height: 70px;
      cursor: pointer;
    }
    .admin-image {
      max-width: 100px;
      max-height: 90px;
      padding-top: 4px;
      margin-left: 5px;
    }
    .admin-name {
      font-size: 18px;
    }
    .admin-username {
      font-weight: 600;
      font-size: 17px;
    }
    .edit-btn {
      color: black;
      font-size: 15px;
    }
    .delete-btn {
      color: red;
      font-size: 15px;
      border: 1px solid red;
    }
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
