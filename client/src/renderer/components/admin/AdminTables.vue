<template>
  <div class="admin-tables">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">Tables</h1>
            <v-btn @click="logoutAdmin" class="logout-btn pink">
              Logout
            </v-btn>
        </div>
      </v-flex>

      <v-flex class="admin-container">
        <!-- Display messages -->
        <div class="error-msg" v-if="error" v-html="error" />
        <div class="success-msg" v-if="success" v-html="success" />

        <!-- Should list all the tables by their owners/users -->
        <div class="list-of-storages">
          <!--
          <v-list two-line>
            <v-list-tile
                v-for="table in this.table"
                :key="table._id"
                @click="viewTable(table._id)"
            >

              <v-list-tile-action>
                  <v-icon>gavel</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{table.name}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{table.articleNumber}}</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
          </v-list>
          -->
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import AuthenticationService from '@/services/AuthenticationService'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      tables: [],
      error: null,
      success: null
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
