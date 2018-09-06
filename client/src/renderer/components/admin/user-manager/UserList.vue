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

          <v-data-table
            :headers="headers"
            :items="users"
            hide-actions
            class="elevation-1"
            dark
          >
            <template slot="items" slot-scope="props">
              <td class="td text-xs-left">
                <img class="user-image" v-if="props.item.image" :src="`http://localhost:8080/${props.item.image}`" />
              </td>
              <td class="td text-xs-left">
                <span class="user-name">
                  {{ props.item.name }}
                </span>
              </td>
              <td class="td text-xs-left">
                <span class="user-username">
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

  .list-of-users {
    width: 100%;

    .td {
      height: 70px;
      cursor: pointer;
    }
    .user-image {
      max-width: 100px;
      max-height: 90px;
      padding-top: 4px;
      margin-left: 5px;
    }
    .user-name {
      font-size: 18px;
    }
    .user-username {
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
