<template>
  <div class="admin-storage-list">
    <div>
      <admin-side-menu />
    </div>
      <v-layout column class="blue right-side">
        <v-flex>
          <div class="admin-header">
              <h1 class="heading">Storage List</h1>
              <v-btn @click="logoutAdmin" class="logout-btn pink">
                Logout
              </v-btn>
          </div>
        </v-flex>

        <v-flex class="admin-container">
          <!-- Display messages -->
          <div class="error-msg" v-if="error" v-html="error" />
          <div class="success-msg" v-if="success" v-html="success" />

          <!-- Should list the storages from the db -->
          <div class="list-of-storages">
            <v-list two-line>
              <v-list-tile
                v-for="storage in this.storages"
                :key="storage._id"
                @click="viewStorage(storage._id)"
              >

                <v-list-tile-action>
                  <v-icon>gavel</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{storage.name}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{storage.articleNumber}}</v-list-tile-sub-title>
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
import StorageService from '@/services/StorageService'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      storages: [],
      error: null,
      success: null
    }
  },
  async mounted() {
    try {
      const response = (await StorageService.getAllStorages()).data

      // Get User list
      if (response.storages) {
        const storages = this.storages
        // Add user in the storages array
        response.storages.forEach(function(user) {
          storages.push(user)
        })
      }
    } catch (error) {
      console.log(error)
      this.success = ''
      this.error = error.response.data.error
    }
  },
  methods: {
    viewStorage(storageId) {
      this.$router.push({name: 'admin-view-storage', params: {storageId}})
    },
    async logoutAdmin() {
      try {
        const response = (await AuthenticationService.logoutAdmin()).data

        if (response.loggedOutMessage) {
          // Set admin and isLoggedIn state to false
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
