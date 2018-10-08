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

        <p>Name: {{this.$store.state.admin.name}}</p>
        <p>Username: {{this.$store.state.admin.username}}</p>
        <p>Store name: {{adminSettings.store}}</p>
        <p>Telephone: </p>
        <p>Address: </p>
        <p>Create date: {{this.$store.state.admin.date}}</p>
        <p>Last time updated: {{this.$store.state.admin.updatedDate}}</p>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
// Global Mixins
import AdminLogout from '@/mixins/AdminLogout'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      adminSettings: {
        store: 'Shambhala store',
        currency: '$'
      },
      // Messages
      error: null,
      success: null,
      info: null
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
