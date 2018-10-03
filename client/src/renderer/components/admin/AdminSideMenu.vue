<template>
  </div>
    <!-- mini-variant option instead of permanent can be used for tablet devices -->
    <v-navigation-drawer stateless permanent value="true" fixed width="260">
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="dashboard-title">
              <v-icon>gavel</v-icon>
              <span class="admin-username">{{ this.$store.state.admin.username }}</span>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- List -->
      <v-list dense class="pt-0">

        <!-- Home -->
        <v-list-tile @click="navigateTo({ name: 'admin-home' })">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="list-tile-title">Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- Warehouse -->
        <v-list-group prepend-icon="storage" value="true">
          <v-list-tile slot="activator">
            <v-list-tile-title class="list-tile-title">Warehouse</v-list-tile-title>
          </v-list-tile>
            <v-list-tile @click="navigateTo({ name: 'admin-storage-list' })">
              <v-list-tile-title>Storage List</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>format_list_numbered</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-tile>
            <v-list-tile @click="navigateTo({ name: 'admin-create-storage' })">
              <v-list-tile-title>Create Storage</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>add</v-icon>
              </v-list-tile-action>
            </v-list-tile>
        </v-list-group>

        <!-- Tables -->
        <v-list-tile @click="navigateTo({ name: 'admin-table-list' })">
          <v-list-tile-action>
            <v-icon>view_carousel</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="list-tile-title">Tables</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- Admin Manager -->
        <v-list-group prepend-icon="gavel" value="true">
          <v-list-tile slot="activator">
            <v-list-tile-title class="list-tile-title">Admin Manager</v-list-tile-title>
          </v-list-tile>
            <v-list-tile @click="navigateTo({ name: 'admin-admin-list' })">
              <v-list-tile-title>Admin List</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>format_list_numbered</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-tile>
            <v-list-tile @click="navigateTo({ name: 'admin-register' })">
              <v-list-tile-title>Create Admin</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>person_add</v-icon>
              </v-list-tile-action>
            </v-list-tile>
        </v-list-group>

        <!-- Staff Manager -->
        <v-list-group prepend-icon="people" value="true">
          <v-list-tile slot="activator">
            <v-list-tile-title class="list-tile-title">Staff Manager</v-list-tile-title>
          </v-list-tile>
            <v-list-tile @click="navigateTo({ name: 'admin-user-list' })">
              <v-list-tile-title>Staff List</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>format_list_bulleted</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile @click="navigateTo({ name: 'admin-create-user' })">
              <v-list-tile-title>Create Staff Member</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>add</v-icon>
              </v-list-tile-action>
            </v-list-tile>
        </v-list-group>

        <!-- Tax manager -->
        <v-list-group prepend-icon="attach_money" value="true">
          <v-list-tile slot="activator">
            <v-list-tile-title class="list-tile-title">Tax Manager</v-list-tile-title>
          </v-list-tile>
            <v-list-tile @click="navigateTo({ name: 'admin-taxes' })">
              <v-list-tile-title>Taxes</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>gavel</v-icon>
              </v-list-tile-action>
            </v-list-tile>
        </v-list-group>

      <!-- End of list -->
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  methods: {
    navigateTo(route) {
      this.$router.push(route)
    }
  }
}
</script>

<style scoped lang="scss">

  .dashboard-title {
  }

  .admin-username {
    font-size: 22px;
    margin-left: 5%;
  }

  .list-tile-title {
    font-size: 16px;
  }

</style>
