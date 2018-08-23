<template>
  <div class="admin-view-storage">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="blue right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">
              Storage: {{storage.name}}
              <v-btn @click="editStorage(storage._id)" class="yellow">
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

        <!-- Should list all the articles in the current storage -->
        <div class="admin-articles-list">
          <p>Article name: </p>
          <p>Quantity: </p>
          <p>Price: </p>
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
      storage: {},
      error: null,
      success: null
    }
  },
  async mounted() {
    try {
      const storageId = this.$store.state.route.params.storageId
      const response = (await StorageService.getStorageById(storageId)).data
      console.log(response)
      // if (response.storage) {
      //   this.storage = response.storage
      // }
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
    editStorage(storageId) {
      this.$router.push({name: 'admin-edit-storage', params: {storageId}})
    }
  }
}
</script>

<style scoped lang="scss">

  .admin-articles-list {
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
