<template>
  <div class="user-tables">
    <h2 class="title">Tables</h2>
    <user-side-menu />

    <v-btn class="logout-btn pink">
      <router-link class="logout-link" to="/user/logout">Logout</router-link>
    </v-btn>
  </div>
</template>

<script>
import UserSideMenu from '@/components/user/UserSideMenu'

export default {
  components: {
    UserSideMenu
  },
  methods: {

  }
}
</script>

<style scoped>

  .list-title {
    font-size: 17px;
  }

  .title {
    position: relative;
    left: 40%;
  }

  .logout-btn {
    position: relative;
    left: 90%;
    z-index: 99;
  }

  .logout-link {
    text-decoration: none;
    color: white;
  }

</style>
