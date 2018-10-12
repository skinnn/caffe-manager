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
        <div class="info-msg" v-if="info" v-html="info" />

        <!-- TODO: Add animation for fetching/displaying Users possibly with Scroll Reveal -->
        <!-- List of all Users/Staff in the db -->
        <div class="list-of-users">
          <!-- <v-list two-line>
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
          </v-list> -->

          <v-data-table
            :headers="headers"
            :items="users"
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
                <v-btn @click="editUserPage(props.item._id)" class="edit-btn yellow">Edit</v-btn>
                <v-btn @click="deleteUser(props.item)" class="delete-btn white">Delete</v-btn>
              </td>
            </template>
          </v-data-table>

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
      adminId: this.$store.state.admin._id,
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
      success: null,
      info: null
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
    },
    editUserPage(userId) {
      this.$router.push({
        name: 'admin-edit-user',
        params: {userId}
      })
    },
    async deleteUser(user) {
      let confirmation = confirm(
        'Are you sure?'
      )
      if (confirmation) {
        try {
          const adminId = this.adminId
          const userId = user._id
          const imgPath = user.image
          const response = (await AdminService.deleteUser(adminId, userId, imgPath)).data
          // If User is deleted successfully
          if (response.deleted) {
            // Set success message and timeout
            this.error = null
            this.success = response.success
            setTimeout(() => {
              this.success = null
            }, 3000)

            // Reset User list after deleting
            const ress = (await AdminService.getAllUsers()).data
            if (ress.users) {
              this.users = []
              const users = this.users
              ress.users.forEach(function(user) {
                users.push(user)
              })
            }
          }
        } catch (error) {
          this.success = null
          this.error = error.response.data.error
        }
      }
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

  .logout-btn {
    margin-right: 10px;
    position: fixed;
    top: 25px;
    left: 91%;
    color: white;
  }

</style>
