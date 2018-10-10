<template>
  <div class="admin-home">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
          <h1 class="heading">
            <v-btn @click="cancelEditing" class="goBackBtn blue" fab>
              <v-icon>arrow_back</v-icon>
            </v-btn>
            Edit Store Settings
          </h1>
          <v-btn @click="logoutAdmin" class="logout-btn pink">
            Logout
          </v-btn>
        </div>
      </v-flex>

      <v-flex class="admin-container">
        <!-- Display messages -->
        <!-- TODO: Create separate Message component and add v-alert to all components for styling messages -->
        <div class="error-msg" v-if="error" v-html="error" />
        <div class="success-msg" v-if="success" v-html="success" />
        <div class="info-msg" v-if="info" v-html="info" />

        <div class="admin-update-settings">
          <!-- Update Settings Form -->
          <v-form
            @submit.prevent="updateSettings"
            enctype="multipart/form-data"
            class="settings-form"
          >
            <h3>Store name:</h3>
            <v-flex xs12 sm5 d-flex>
              <v-text-field
                type="text"
                v-model="settings.store_name"
                solo
              ></v-text-field>
            </v-flex>

            <h3>Store address:</h3>
            <v-flex xs12 sm5 d-flex>
              <v-text-field
                type="text"
                v-model="settings.store_address"
                solo
              ></v-text-field>
            </v-flex>

            <h3>Currency:</h3>
            <v-flex xs12 sm5 d-flex>
              <v-select
                :items="select.currency"
                v-model="settings.currency"
                label="Select"
                solo
              ></v-select>
            </v-flex>

            <h3>Store Phone 1:</h3>
            <v-flex xs12 sm5 d-flex>
              <v-text-field
                type="text"
                v-model="settings.store_phone1"
                solo
              ></v-text-field>
            </v-flex>

            <h3>Store Phone 2:</h3>
            <v-flex xs12 sm5 d-flex>
              <v-text-field
                type="text"
                v-model="settings.store_phone2"
                solo
              ></v-text-field>
            </v-flex>

            <h3>Last time the settings were updated:</h3>
            <v-flex xs12 sm5 d-flex>
              <v-text-field
                readonly
                type="text"
                :value="this.$store.state.settings.updated_date"
                solo
              ></v-text-field>
            </v-flex>

            <h3>Store Image</h3>
            <br>
            <!-- TODO: Create image preview -->
            <div class="upload-image">
              <input id="storeImage" type="file" name="imageUpload" />
            </div>
            <br>

            <v-btn type="submit" class="success">Submit</v-btn>
            <v-btn @click="cancelEditing" class="error">Cancel</v-btn>
          </v-form>

        </div>

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// Components
import AdminSideMenu from '@/components/admin/AdminSideMenu'
// Services
import SettingsService from '@/services/SettingsService'
// Global Mixins
import AdminLogout from '@/mixins/AdminLogout'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      settings: {},
      adminId: this.$store.state.admin._id,
      select: {
        currency: ['$', '€', 'RSD']
      },
      error: null,
      success: null,
      info: null
    }
  },
  async mounted() {
    try {
      let adminId = this.ownerId
      const response = (await SettingsService.getOrCreateAdminSettings(adminId)).data
      if (response.settings) {
        this.settings = response.settings
      }
    } catch (error) {
      this.success = null
      this.info = null
      this.error = error.response.data.error
    }
  },
  methods: {
    async updateSettings() {
      try {
        // Get Admin id
        const adminId = this.ownerId
        // Create form data
        const settingsFormData = new FormData()
        // Get new image
        const imagefile = await document.querySelector('#storeImage')
        const storeImage = await imagefile.files[0]
        // Get old image if one is there
        const oldImage = this.settings.store_image
        // Get all text inputs
        const storeName = this.settings.store_name
        const storeAddress = this.settings.store_address
        const storeCurrency = this.settings.currency
        const storePhone1 = this.settings.store_phone1
        const storePhone2 = this.settings.store_phone2
        // Append everything to form data
        settingsFormData.append('imageUpload', storeImage)
        settingsFormData.append('storeName', storeName)
        settingsFormData.append('storeAddress', storeAddress)
        settingsFormData.append('storeCurrency', storeCurrency)
        settingsFormData.append('storePhone1', storePhone1)
        settingsFormData.append('storePhone2', storePhone2)
        settingsFormData.append('oldImage', oldImage)

        // Update Settings
        const response = (await SettingsService.updateAdminSettings(adminId, settingsFormData)).data
        // If successfully updated the settings
        if (response.saved) {
          // Update Settings in the Vuex Store
          this.$store.dispatch('setSettings', response.settings)
          // Success message
          this.error = null
          this.info = null
          this.success = response.success
          setTimeout(() => {
            this.success = null
          }, 3000)
        }
      } catch (error) {
        this.success = null
        this.info = null
        this.error = error.response.data.error
      }
    },
    cancelEditing() {
      this.$router.push({
        name: 'admin-settings'
      })
    }
  },
  mixins: [
    AdminLogout
  ]
}
</script>

<style scoped lang="scss">

  .admin-container {

    .admin-settings {
      background-color: lighten(grey, 40);

      .settings-form {
        margin-left: 50px;
      }
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
