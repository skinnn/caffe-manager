<template>
  <div class="home">
    <h1>Home</h1>
    <router-link to="page">page</router-link>
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
        <input
          type="password2"
          name="password2"
          v-model="password2"
          placeholder="Confirm password" />
      <br>
      <button @click="register" name="button">Register</button>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  data() {
    return {
      username: '',
      password: '',
      password2: ''
    }
  },
  methods: {
    async register() {
      const response = await AuthenticationService.register({
        username: this.username,
        password: this.password,
        password2: this.password2
      })
      console.log(response.data)
    },
    async login() {
      const response = await AuthenticationService.login({
        username: this.username,
        password: this.password
      })
      console.log(response.data)
    }
  }
}
</script>

<style>
</style>
