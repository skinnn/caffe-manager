<template>
  <div>
    <v-navigation-drawer permanent>
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
                <v-icon>settings</v-icon>
                User
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list dense class="pt-0 blue">
        <v-list-tile
          color="white"
          active-class="default-class my-class"
          v-for="item in this.userMenu"
          :key="item.title"
          @click=""
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title class="list-title">
              {{ item.title }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import UserMenuService from '@/services/UserMenuService'

export default {
  data() {
    return {
      users: [],
      userMenu: []
    }
  },
  methods: {
    navigateTo() {
      this.$router.push({
        name: 'user-tables'
      })
    }
  },
  async mounted() {
    this.users = (await UserMenuService.getUserMenu()).data
    // TODO: Serve menu only from the user who is logged in

    // Menu from the first user in the array
    this.userMenu = this.users[0].userMenu
    console.log(this.users[0].userMenu[0])
  }
}
</script>

<style scoped>

  .my-class {
    background-color: red;
  }

  .list-title {
    font-size: 17px;
  }

</style>
