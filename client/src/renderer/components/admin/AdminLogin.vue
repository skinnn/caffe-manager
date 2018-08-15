<template>
  <div class="login-page">
    <h1>Login</h1>
      <input
        type="text"
        name="username"
        v-model="username"
        placeholder="Username" />
      <br>
      <br>
      <input
        type="password"
        name="password"
        v-model="password"
        placeholder="Password" />
      <br>
      <br>
      <button @click="login" name="button">Login</button>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await AuthenticationService.login({
          username: this.username,
          password: this.password
        })
        // this.$router.push({
        //   name: 'admin-home'
        // })
        console.log(response.data)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>
</style>
