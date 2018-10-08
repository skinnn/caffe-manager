<template>
  <div class="admin-create-storage">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">
              Create Storage
            </h1>
            <v-btn @click="logoutAdmin" class="logout-btn pink">
              Logout
            </v-btn>
        </div>
      </v-flex>

      <v-flex class="admin-container">
          <v-text-field
            type="text"
            v-model="storageName"
            label="Storage Name:"
            outline
          ></v-text-field>

          <!-- Display messages -->
          <div class="error-msg" v-if="error" v-html="error" />
          <div class="success-msg" v-if="success" v-html="success" />

          <v-btn @click="createStorage()" class="yellow">
            Create
          </v-btn>

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import StorageService from '@/services/StorageService'
// Global Mixins
import AdminLogout from '@/mixins/AdminLogout'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      storageName: '',
      error: null,
      success: null
    }
  },
  mounted() {

  },
  methods: {
    async createStorage() {
      try {
        const response = (await StorageService.createStorage({
          storageName: this.storageName
        })).data

        if (response.saved) {
          this.success = response.success
          setTimeout(() => {
            this.success = null
          }, 3000)
          console.log(response)
        }
      } catch (error) {
        console.log(error)
        this.success = ''
        this.error = error.response.data.error
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

  .logout-btn {
    margin-right: 10px;
    position: fixed;
    top: 25px;
    left: 91%;
    color: white;
  }

</style>
