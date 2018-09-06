<template>
  <div class="admin-edit">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">
              Create Staff Member
            </h1>
            <v-btn @click="logoutAdmin" class="logout-btn pink">
              Logout
            </v-btn>
        </div>
      </v-flex>

      <v-flex class="admin-container">
        <v-form @submit.prevent="registerUser" enctype="multipart/form-data">
          <v-text-field
            type="text"
            v-model="username"
            label="Username:"
            outline
          ></v-text-field>
          <v-text-field
            type="password"
            v-model="password"
            label="Password:"
            outline
          ></v-text-field>
          <v-text-field
            type="password"
            v-model="password2"
            label="Confirm Password:"
            outline
          ></v-text-field>
          <v-text-field
            type="text"
            v-model="name"
            label="Full name:"
            outline
          ></v-text-field>

          <h3 class="mt-4">Permissions</h3>
          <v-checkbox
            :label="`Warehouse - ${userMenu.warehouse.toString()}`"
            v-model="userMenu.warehouse"
          ></v-checkbox>
          <v-checkbox
            :label="`Tables - ${userMenu.tables.toString()}`"
            v-model="userMenu.tables"
          ></v-checkbox>

          <div class="upload-image">
            <label>Add Image</label>
            <input id="userImage" type="file" name="imageUpload" />
          </div>

          <!-- Display messages -->
          <div class="error-msg" v-if="error" v-html="error" />
          <div class="success-msg" v-if="success" v-html="success" />

          <v-btn type="submit" class="yellow">
            Create
          </v-btn>
        </v-form>
      </v-flex>

    </v-layout>
  </div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import AuthenticationService from '@/services/AuthenticationService'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      username: '',
      name: '',
      password: '',
      password2: '',
      userMenu: {
        home: true, // Default is that all users have home page
        warehouse: false,
        tables: false
      },
      createdBy: {
        id: this.$store.state.admin._id,
        name: this.$store.state.admin.name,
        username: this.$store.state.admin.username
      },
      error: null,
      success: null
    }
  },
  mounted() {

  },
  methods: {
    async registerUser() {
      try {
        const userFormData = new FormData()
        // Get image
        const imagefile = document.querySelector('#userImage')
        const image = imagefile.files[0]
        // Get and append text inputs to form data
        const userUsername = this.username
        const userName = this.name
        const userPassword = this.password
        const userPassword2 = this.password2
        // Permisions - user menu
        const userMenu = {
          home: this.userMenu.home,
          warehouse: this.userMenu.warehouse,
          tables: this.userMenu.tables
        }
        // Created By
        const createdBy = this.createdBy
        // Append everything to form data
        userFormData.append('imageUpload', image)
        userFormData.append('userUsername', userUsername)
        userFormData.append('userName', userName)
        userFormData.append('userPassword', userPassword)
        userFormData.append('userPassword2', userPassword2)
        userFormData.append('userMenu', userMenu)
        userFormData.append('createdBy', createdBy)

        // Register User
        const response = (await AuthenticationService.registerUser(userFormData)).data

        // If registering was successful
        if (response.user) {
          // Set success message and timeout
          this.success = `User with username <span style="color: blue; font-size:17px;">${this.username}</span>
           registered successfully.`
          this.error = ''
          setTimeout(() => {
            this.success = null
          }, 3000)

          // Set input values to default after registering
          this.username = ''
          this.password = ''
          this.password2 = ''
          this.name = ''
          this.userMenu.home = true
          this.userMenu.warehouse = false
          this.userMenu.tables = false
        }
      } catch (error) {
        console.log(error)
        this.success = ''
        this.error = error.response.data.error
      }
    },
    async logoutAdmin() {
      try {
        const response = (await AuthenticationService.logoutAdmin()).data

        if (response.loggedOutMessage) {
          // Set admin and isLoggedIn states to false
          this.$store.dispatch('setAdmin', null)
          // Redirect to admin login page
          this.$router.push({
            name: 'admin-login'
          })
        }
      } catch (error) {
        this.success = null
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<style scoped lang="scss">

  .list-title {
    font-size: 17px;
  }

 .logout-btn {
    margin-right: 10px;
    position: fixed;
    top: 25px;
    left: 91%;
    color: white;
  }

</style>
