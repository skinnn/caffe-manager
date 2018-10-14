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
          <admin-logout-btn />
        </div>
      </v-flex>

      <v-flex class="admin-container">

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
            <div class="upload-image">
              <input
                type="file"
                @change="imagePreview(this)"
                id="storeImage"
                name="imageUpload"
              />
              <img id="previewImg" class="previewImg"
                :src="`http://localhost:8080/${currentStoreImage}`"
                alt="">
              <!-- Preview Image placeholder -->
              <img v-if="!currentStoreImage && currentStoreImage !== ''" class="previewImgPlaceholder" src="" alt="">
            </div>
            <br>

            <!-- Display messages -->
            <!-- TODO: Create separate GLOBAL Message component and add v-alert to all components for styling messages -->
            <div class="error-msg" v-if="error" v-html="error" />
            <div class="success-msg" v-if="success" v-html="success" />
            <div class="info-msg" v-if="info" v-html="info" />

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

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      settings: {},
      currentStoreImage: this.$store.state.settings.store_image,
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
    imagePreview() {
      const img = document.getElementById('storeImage').files
      const previewImg = document.getElementById('previewImg')
      var reader = new FileReader()
      reader.onload = function(e) {
        previewImg.src = e.target.result
      }
      reader.readAsDataURL(img[0])
    },
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
  }
}
</script>

<style scoped lang="scss">

  .admin-container {

    .admin-update-settings {

      .settings-form {
        margin-left: 50px;
      }

      .previewImg {
        min-width: 150px;
        min-height: 150px;
        max-width: 300px;
        max-height: 300px;
        border: 1px solid orange;
        border-radius: 3px;
        margin: 10px 0 0 10px;
        display: block;
      }

      .previewImgPlaceholder {
        width: 150px;
        height: 150px;
        border: 1px solid orange;
        border-radius: 3px;
        margin: 10px 0 0 10px;
        display: block;
      }

      .previewImgInput {
        margin: 5px 0 0 10px;
      }
    }
  }

  .list-title {
    font-size: 17px;
  }

</style>
