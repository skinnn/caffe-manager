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
  import AdminService from '@/services/AdminService'

  export default {
    name: 'client',
    components: {
      AdminSideMenu,
      UserSideMenu
    },
    async mounted() {
      try {
        // Get or Create Root Admin if it doesn't exist
        const response = (await AdminService.createRootAdmin()).data
        // console.log(response)
        if (response.rootExist) {
          return console.log(response.message)
        } else if (response.rootCreated) {
          return console.log(response.message)
        }
      } catch (error) {
        return console.log(error)
      }
    }
  }
</script>

<style lang="scss">

  .v-list__group__header {
    background-color: #f4f4f4;

    &:hover {
      color: grey;
    }
  }

  .v-list__tile--link {
    // background-color: #f4f4f4;

    &:hover {
      color: grey;
    }
  }

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
    height: 100px;
    width: calc(100% - 260px); /* where 260px is width of admin side menu */
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

  .info-msg {
    background-color: #add8e6;
    color: blue;
    border-radius: 5px;
    padding: 7px;
    text-align: center;
    font-size: 15px;
  }

</style>
