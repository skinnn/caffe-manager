<template>
  <div class="user-home">
    <div>
      <user-side-menu />
    </div>
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
    navigateTo() {
      this.$router.push({
        name: 'user-tables'
      })
    }
  }
}
</script>

<style scoped>

  .list-title {
    font-size: 17px;
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
