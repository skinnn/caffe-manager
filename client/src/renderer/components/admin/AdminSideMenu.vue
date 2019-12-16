<template>
  <div>
    <!-- mini-variant option instead of permanent can be used for tablet devices -->
    <v-navigation-drawer class="navigationDrawer" value="true" permanent fixed width="260">
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
        <v-list-tile
          v-bind:class="{ activePage : isActivePage === 'home' }"
          @click="navigateTo({ name: 'admin-home' }), setActivePage('home')"
        >
          <v-list-tile-action>
            <v-icon class="list-icon">dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="list-tile-title">Dashboard</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- Store Settings -->
        <v-list-tile
          v-bind:class="{ activePage : isActivePage === 'settings' }"
          @click="navigateTo({ name: 'admin-settings' }), setActivePage('settings')"
        >
          <v-list-tile-action>
            <v-icon class="list-icon">settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="list-tile-title">Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- Tables -->
        <v-list-tile
          v-bind:class="{ activePage : isActivePage === 'table list' }"
          @click="navigateTo({ name: 'admin-table-list' }), setActivePage('table list')"
        >
          <v-list-tile-action>
            <v-icon class="list-icon">view_carousel</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="list-tile-title">Tables</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- Warehouse -->
        <!-- TODO: Create Article list where all articles from the store are listed -->
        <v-list-group prepend-icon="storage">
          <v-list-tile slot="activator">
            <v-list-tile-title class="list-tile-title">Warehouse</v-list-tile-title>
          </v-list-tile>
            <v-list-tile
              v-bind:class="{ activePage : isActivePage === 'storage list' }"
              @click="navigateTo({ name: 'admin-storage-list' }), setActivePage('storage list')"
            >
              <v-list-tile-title>Storage List</v-list-tile-title>
              <v-list-tile-action>
                <v-icon class="list-icon">format_list_numbered</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile
              v-bind:class="{ activePage : isActivePage === 'create storage' }"
              @click="navigateTo({ name: 'admin-create-storage' }), setActivePage('create storage')"
            >
              <v-list-tile-title>Create Storage</v-list-tile-title>
              <v-list-tile-action>
                <v-icon class="list-icon">add</v-icon>
              </v-list-tile-action>
            </v-list-tile>
        </v-list-group>

        <!-- Admin Manager -->
        <v-list-group v-if="isRootUser === true" prepend-icon="gavel">
          <v-list-tile slot="activator">
            <v-list-tile-title class="list-tile-title">Admin Manager</v-list-tile-title>
          </v-list-tile>
            <v-list-tile
              v-bind:class="{ activePage : isActivePage === 'admin list' }"
              @click="navigateTo({ name: 'admin-admin-list' }), setActivePage('admin list')"
            >
              <v-list-tile-title>Admin List</v-list-tile-title>
              <v-list-tile-action>
                <v-icon class="list-icon">format_list_numbered</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile
              v-bind:class="{ activePage : isActivePage === 'admin register' }"
              @click="navigateTo({ name: 'admin-register' }), setActivePage('admin register')"
            >
              <v-list-tile-title>Create Admin</v-list-tile-title>
              <v-list-tile-action>
                <v-icon class="list-icon">person_add</v-icon>
              </v-list-tile-action>
            </v-list-tile>
        </v-list-group>

        <!-- Staff Manager -->
        <v-list-group prepend-icon="people">
          <v-list-tile slot="activator">
            <v-list-tile-title class="list-tile-title">Staff Manager</v-list-tile-title>
          </v-list-tile>
            <v-list-tile
              v-bind:class="{ activePage : isActivePage === 'user list' }"
              @click="navigateTo({ name: 'admin-user-list' }), setActivePage('user list')"
            >
              <v-list-tile-title>Staff List</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>format_list_bulleted</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile
              v-bind:class="{ activePage : isActivePage === 'create user' }"
              @click="navigateTo({ name: 'admin-create-user' }), setActivePage('create user')"
            >
              <v-list-tile-title>Create Staff Member</v-list-tile-title>
              <v-list-tile-action>
                <v-icon class="list-icon">add</v-icon>
              </v-list-tile-action>
            </v-list-tile>
        </v-list-group>

        <!-- Tax manager -->
        <v-list-group prepend-icon="attach_money">
          <v-list-tile slot="activator">
            <v-list-tile-title class="list-tile-title">Tax Manager</v-list-tile-title>
          </v-list-tile>
            <v-list-tile
              v-bind:class="{ activePage : isActivePage === 'taxes' }"
              @click="navigateTo({ name: 'admin-taxes' }), setActivePage('taxes')"
            >
              <v-list-tile-title>Taxes</v-list-tile-title>
              <v-list-tile-action>
                <v-icon class="list-icon">gavel</v-icon>
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
  data() {
    return {
      isRootUser: this.$store.state.admin.root_user,
      defaultActive: 'home',
      isActivePage: this.$store.state.activePage
    }
  },
  methods: {
    setActivePage(page) {
      // Set Active Page
      if (page === 'home') {
        return this.$store.dispatch('setActivePage', page)
      }
      if (page === 'settings') {
        return this.$store.dispatch('setActivePage', page)
      }
      if (page === 'storage list') {
        return this.$store.dispatch('setActivePage', page)
      }
      if (page === 'create storage') {
        return this.$store.dispatch('setActivePage', page)
      }
      if (page === 'table list') {
        return this.$store.dispatch('setActivePage', page)
      }
      if (page === 'admin list') {
        return this.$store.dispatch('setActivePage', page)
      }
      if (page === 'admin register') {
        return this.$store.dispatch('setActivePage', page)
      }
      if (page === 'user list') {
        return this.$store.dispatch('setActivePage', page)
      }
      if (page === 'create user') {
        return this.$store.dispatch('setActivePage', page)
      }
      if (page === 'taxes') {
        return this.$store.dispatch('setActivePage', page)
      }
    },
    navigateTo(route, page) {
      this.$router.push(route)
    }
  }
}
</script>

<style scoped lang="scss">

  .navigationDrawer {
    border-right: 1px solid #3d3d3d;
  }

  nav {
    height: 98px;

    .v-list {
      margin-top: 35px;
      background-color: lighten(grey, 40);

      .v-list__tile__title {
        font-size: 25px;
        .material-icons {
          color: blue;
          font-size: 25px;
        }
      }
    }
  }

  .activePage {
    background-color: #404040;
    color: white;

    .list-icon {
      color: white;
    }
  }

  .admin-username {
    font-size: 22px;
    margin-left: 5%;
  }

  .list-tile-title {
    font-size: 16px;
    font-weight: 600;
  }

</style>
