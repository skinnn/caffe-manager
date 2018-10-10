<template>
  <div class="admin-home">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">Home</h1>
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
        <v-btn @click="getSettingsPage" class="blue" title="Open settings">
          Store Settings
          <br>
          <v-icon>settings</v-icon>
        </v-btn>
        <p>Name: {{$store.state.admin.name}}</p>
        <p>Username: {{$store.state.admin.username}}</p>
        <p>Store name: {{$store.state.settings.store_name}}</p>
        <p>Telephone: </p>
        <p>Address: </p>
        <p>Create date: {{$store.state.admin.date}}</p>
        <p>Last time updated: {{$store.state.admin.updatedDate}}</p>

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// Components
import AdminSideMenu from '@/components/admin/AdminSideMenu'
// Global Mixins
import AdminLogout from '@/mixins/AdminLogout'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      ownerId: this.$store.state.admin._id,
      error: null,
      success: null,
      info: null
    }
  },
  methods: {
    getSettingsPage() {
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
