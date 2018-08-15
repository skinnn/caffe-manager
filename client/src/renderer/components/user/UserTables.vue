<template>
  <div class="user-tables">
    <user-side-menu />
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

  .active {

  }

</style>
