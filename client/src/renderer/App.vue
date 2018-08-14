<template>
  <div id="app">
    <v-container fluid>
      <v-app>
        <router-view></router-view>
      </v-app>
    </v-container>
  </div>
</template>

<script>
  import AdminSideMenu from '@/components/admin/AdminSideMenu'
  import UserSideMenu from '@/components/user/UserSideMenu'

  export default {
    name: 'client',
    components: {
      AdminSideMenu,
      UserSideMenu
    }
  }
</script>

<style>
  /* CSS */
</style>
