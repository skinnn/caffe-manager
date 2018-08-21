<template>
  <div id="app">
    <v-container fluid class="pt-0">
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

<style lang="scss">

  .admin-container {
    margin-top: 100px;
    margin-left: 0;
    height: 100%;
    width: 100%;
    // margin-left: 40px;
  }

  .user-container {
    height: 100%;
    width: 100%;
    // margin-left: 40px;
  }

  .right-side {
    margin-left: 236px;
    // width: 100%;
  }

  .admin-header {
    position: fixed;
    min-height: 100px;
    width: 100%;
    color: white;
    background-color: #3d3d3d;
    border-bottom: 1px solid white;
    z-index: 1;
  }

  .heading {
    position: relative;
    top: 25px;
    left: 6%;
    font-size: 31px;
  }

  .error-msg {
    background-color: pink;
    color: red;
    border-radius: 5px;
    padding: 7px;
    text-align: center;
    font-size: 15px;
  }

  .success-msg {
    background-color: #b2ffb2;
    color: green;
    border-radius: 5px;
    padding: 7px;
    text-align: center;
    font-size: 15px;
  }

</style>
