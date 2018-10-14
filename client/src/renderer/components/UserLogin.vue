<template>
  <v-layout row class="mt-5">
    <v-flex xs5 offset-xs3>
      <div class="white elevation-5">
        <v-toolbar class="black toolbar" flat dense>
          <v-toolbar-title class="toolbar-title">User Login</v-toolbar-title>
        </v-toolbar>
        <div class="register-page pl-4 pr-4 pb-3 pt-4">
          <!-- <router-link to="/admin/register"><v-btn color="blue">Admin Register</v-btn></router-link> -->
          <router-link to="/admin/login"><v-btn color="blue">Admin Login</v-btn></router-link>
          <router-link to="/admin/landingpage/register"><v-btn color="blue">Admin Register</v-btn></router-link>
          <router-link to="/" event=""><v-btn color="blue">User Login</v-btn></router-link>

          <!-- TODO: List all User accounts on the side and fill username by clicking on it -->
          <v-form @keyup.enter.native="loginUser">
            <v-text-field
              type="text"
              v-model="username"
              label="Username:"
              outline
              ></v-text-field>
            <v-text-field
              id="pwFocus"
              type="password"
              v-model="password"
              label="Password:"
              outline
              ></v-text-field>
          </v-form>

          <!-- Display messages -->
          <div class="error-msg" v-if="error" v-html="error" />
          <div class="success-msg" v-if="success" v-html="success" />
          <div class="info-msg" v-if="info" v-html="info" />
          <div class="msg-placeholder" v-if="!info && !success && !error" v-html="" />
          <br>
          <v-btn class="green login-button"
            block
            @click.prevent="loginUser">
            Login
          </v-btn>
        </div>

      </div>
    </v-flex>
    <v-flex xs4>
      <div class="elevation-5">
        <!-- TODO: When clicked on the name populate the username input field -->
        <ul class="userList">
          <h3 v-if="userList.length < 1" class="userListEmptyText">No users</h3>
          <li
            v-for="user in this.userList"
            :key="user._id"
            @click="populateUsername(user.username)"
            class="singleUserLi"
          >
          <div class="singleUserDiv">{{user.name}}</div>
          </li>
        </ul>

      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import AdminService from '@/services/AdminService'

export default {
  data() {
    return {
      userList: [],
      username: '',
      password: '',
      // Messages
      error: null,
      success: null,
      info: null
    }
  },
  async mounted() {
    const response = (await AdminService.getUserLoginList()).data
    console.log(response)
    let userList = this.userList
    response.users.forEach(function(user) {
      userList.push(user)
    })
    // TODO: Fire this only if logout was clicked
    if (!this.$store.state.isUserLoggedIn) {
      this.success = 'Logged out.'
      setTimeout(() => {
        this.success = null
      }, 3000)
    }
  },
  methods: {
    populateUsername(username) {
      this.username = username
      this.password = ''
      document.getElementById('pwFocus').focus()
    },
    async loginUser() {
      try {
        const response = (await AuthenticationService.loginUser({
          username: this.username,
          password: this.password
        })).data
        // Navigate to user home page
        if (response.user) {
          this.$router.push({
            name: 'user-home'
          })
          // Set user in the vuex store
          this.$store.dispatch('setUser', response.user)
        }

        // console.log('Login successfull: ', response.user.username)
      } catch (error) {
        console.log(error)
        this.success = null
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<style scoped lang="scss">

  .toolbar-title {
    color: white;
  }

  .userList {
    list-style: none;
    display: table;
    position: fixed;
    min-height: 378px;
    min-width: 430px;
    padding: 0 10px 0 10px;
    left: 67%;
    border: 1px solid grey;
    border-radius: 5px;
    background-color: lighten(grey, 40);

    .singleUserLi {
      cursor: pointer;
      list-style: none;
      text-align: left;
      font-size: 18px;
      margin: 10px 0 0 0;
      &:hover {
        .singleUserDiv {
          background-color: lighten(green, 40);
          border-left: 2px solid green;
        }
      }

      .singleUserDiv {
        min-height: 50px;
        background-color: lighten(green, 55);
        padding: 10px;
        border-radius: 10px;
        display: table;
      }
    }

    .userListEmptyText {
      text-align: center;
      font-size: 20px;
    }
  }

  .msg-placeholder {
    height: 36px;
  }

</style>
