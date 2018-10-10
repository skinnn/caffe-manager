<template>
  <div class="admin-home">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">
              Settings
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
          <p>Store name: {{this.settings.store_name}}</p>
          <p>Address: {{this.settings.store_address}}</p>
          <p>Currency: {{this.settings.currency}}</p>
          <p>Telephone 1: {{this.settings.store_phone1}}</p>
          <p>Telephone 2: {{this.settings.store_phone2}}</p>
          <p>Last time updated: {{this.settings.updated_date}}</p>
          <img src="" alt="No store image">
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

      .adminSettingsHeading {
        text-align: center;
        margin: 0 0 15px 0;
      }

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
