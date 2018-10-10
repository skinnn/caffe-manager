<template>
  <div class="admin-home">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
          <h1 class="heading">
            <v-btn @click="goBack" class="goBackBtn blue" fab>
              <v-icon>arrow_back</v-icon>
            </v-btn>
            Store Settings
            <v-btn @click="editSettings" class="yellow">
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
        <!-- TODO: Create separate Message component and add v-alert to all components for styling messages -->
        <div class="error-msg" v-if="error" v-html="error" />
        <div class="success-msg" v-if="success" v-html="success" />
        <div class="info-msg" v-if="info" v-html="info" />

        <div class="admin-settings">
          <img
            v-if="settings.store_image"
            :src="`http://localhost:8080/${settings.store_image}`"
            class="storeImage"
            alt="No image"
          >
          <!-- Placeholder if there is no article image -->
          <div v-if="!settings.store_image" class="noStoreImage">
            <p class="noStoreImageInfo">Store image not set</p>
          </div>
          <div class="settings-info">
            <h1>
              <span class="info-left">Store name: </span>
              <span class="info-right">{{settings.store_name}}</span>
            </h1>
            <h2>
              <span class="info-left">Address: </span>
              <span class="info-right">{{settings.store_address}}</span>
            </h2>
            <h2>
              <span class="info-left">Currency: </span>
              <span class="info-right">{{settings.currency}}</span>
            </h2>
            <h2>
              <span class="info-left">Telephone 1: </span>
              <span class="info-right">{{settings.store_phone1}}</span>
            </h2>
            <h2>
              <span class="info-left">Telephone 2: </span>
              <span class="info-right">{{settings.store_phone2}}</span>
            </h2>
            <h2>
              <span class="info-left">Last time updated: </span>
              <span class="info-right">{{settings.updated_date}}</span>
            </h2>
          </div>
        </div>

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// Components
import AdminSideMenu from '@/components/admin/AdminSideMenu'
// Services
// import SettingsService from '@/services/SettingsService'
// Global Mixins
import AdminLogout from '@/mixins/AdminLogout'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      settings: {
        store_name: this.$store.state.settings.store_name,
        store_address: this.$store.state.settings.store_address,
        store_phone1: this.$store.state.settings.store_phone1,
        store_phone2: this.$store.state.settings.store_phone2,
        store_image: this.$store.state.settings.store_image,
        currency: this.$store.state.settings.currency,
        updated_date: this.$store.state.settings.updated_date
      },
      error: null,
      success: null,
      info: null
    }
  },
  methods: {
    editSettings() {
      this.$router.push({
        name: 'admin-edit-settings'
      })
    },
    goBack() {
      // Redirect to Admin Home page
      this.$router.push({
        name: 'admin-home'
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
      padding: 3%;
      width: 100%;

      .storeImage {
        vertical-align: top;
        max-width: 300px;
        max-height: 200px;
        min-width: 270px;
        display: inline-block;
        border: 1px solid grey;
        border-radius: 5px;
      }

      .noStoreImage {
        vertical-align: top;
        width: 300px;
        height: 200px;
        max-width: 300px;
        max-height: 200px;
        display: inline-block;
        border: 1px solid grey;
        border-radius: 5px;
        background-color: #f4f4f4;

        .noStoreImageInfo {
          text-align: center;
          position: relative;
          top: 6%;
          margin: 0;
        }
      }

      .settings-info {
        display: inline-block;
        background-color: #f4f4f4;
        max-width: 706px;
        margin-left: 40px;
        padding: 5px 15px 5px 15px;
        border-radius: 5px;
      }

      .info-left {
        color: grey;
        font-size: 18px;
        font-weight: 400;
      }

      .info-right {
        color: black;
        font-size: 21px;
        font-weight: 400;
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
