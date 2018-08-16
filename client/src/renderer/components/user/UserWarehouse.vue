<template>
  <div class="user-warehouse">
    <h2 class="title">Warehouse</h2>
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

</style>
