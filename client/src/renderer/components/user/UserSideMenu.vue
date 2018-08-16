<template>
  <div>
    <v-navigation-drawer permanent fixed width="260">
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
                <v-icon>settings</v-icon>
                {{ $store.state.user.username }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list class="pt-0 pb-0">
        <v-list-tile
          v-for="item in this.userMenu"
          :key="item.title"
          @click="navigateTo(item.route)"
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
import UserService from '@/services/UserService'

export default {
  data() {
    return {
      user: null,
      userMenu: []
    }
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route)
    }
  },
  async mounted() {
    const response = (await UserService.getUserHome()).data
    console.log(response)
    // TODO: Serve menu only from the user who is logged in

    if (response.userMenu[1].tables) {
      let tables = response.userMenu[1]
      this.userMenu.push(tables)
      // console.log('Tables: ', tables)
    }

    if (response.userMenu[0].warehouse) {
      let warehouse = response.userMenu[0]
      this.userMenu.push(warehouse)
      // console.log('Warehouse: ', warehouse)
    }

    /*
      Menu from the first user in the users array
    */

    // Push tables to the menu if there is permission
    // if (this.users[0].userMenu[1].tables) {
    //   let tables = this.users[0].userMenu[1]
    //   this.userMenu.push(tables)
    // }

    // Push warehouse to the menu if there is permission
    // if (this.users[0].userMenu[0].warehouse) {
    //   let warehouse = this.users[0].userMenu[0]
    //   this.userMenu.push(warehouse)
    // }

    console.log('Current menu is: ', this.userMenu)
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
