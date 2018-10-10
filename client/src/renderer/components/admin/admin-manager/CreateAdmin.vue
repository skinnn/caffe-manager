<template>
  <div class="admin-edit">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">
              Create Admin
            </h1>
            <v-btn @click="logoutAdmin" class="logout-btn pink">
              Logout
            </v-btn>
        </div>
      </v-flex>

      <v-flex class="admin-container">
        <v-form @submit.prevent="registerAdmin" enctype="multipart/form-data">
          <v-flex xs12 sm6 d-flex>
            <v-text-field
              type="text"
              v-model="username"
              label="Username:"
              outline
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm6 d-flex>
            <v-text-field
              type="password"
              v-model="password"
              label="Password:"
              outline
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm6 d-flex>
            <v-text-field
              type="password"
              v-model="password2"
              label="Confirm Password:"
              outline
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm6 d-flex>
            <v-text-field
              type="text"
              v-model="name"
              label="Full name:"
              outline
            ></v-text-field>
          </v-flex>

          <div class="upload-image">
            <label>Add Image</label>
            <input id="adminImage" type="file" name="imageUpload" />
          </div>

          <!-- Display messages -->
          <div class="error-msg" v-if="error" v-html="error" />
          <div class="success-msg" v-if="success" v-html="success" />
          <div class="info-msg" v-if="info" v-html="info" />

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
// Global Mixins
import AdminLogout from '@/mixins/AdminLogout'

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
      createdBy: {
        id: this.$store.state.admin._id,
        name: this.$store.state.admin.name,
        username: this.$store.state.admin.username
      },
      error: null,
      info: null,
      success: null
    }
  },
  mounted() {

  },
  methods: {
    async registerAdmin() {
      try {
        // Check if someone is trying to create account with 'admin' or 'root' usernames
        if (this.username !== 'admin' && this.username !== 'root') {
          const adminFormData = new FormData()
          // Get image
          const imagefile = document.querySelector('#adminImage')
          const image = imagefile.files[0]
          // Get and append text inputs to form data
          const adminUsername = this.username
          const adminName = this.name
          const adminPassword = this.password
          const adminPassword2 = this.password2
          // Admin which created this admin account
          const createdBy = this.createdBy
          // Append everything to form data
          adminFormData.append('imageUpload', image)
          adminFormData.append('adminUsername', adminUsername)
          adminFormData.append('adminName', adminName)
          adminFormData.append('adminPassword', adminPassword)
          adminFormData.append('adminPassword2', adminPassword2)
          adminFormData.append('createdBy', createdBy)

          // Register admin
          const response = (await AuthenticationService.registerAdmin(adminFormData)).data
          // If registering was successful redirect to the admin list
          if (response.admin) {
            this.$router.push({
              name: 'admin-register'
            })

            // Set success message and timeout
            this.error = null
            this.info = null
            this.success = `Admin with username <span style="color: blue; font-size:17px;">${this.username}</span>
             registered successfully.`
            setTimeout(() => {
              this.success = null
            }, 3000)

            // Set input values after registering to blank
            this.username = ''
            this.password = ''
            this.password2 = ''
            this.name = ''
          }
        // If someone is trying to register the account with 'admin' or 'root' usernames
        } else {
          this.error = `Can't create account with admin or root usernames.`
          this.info = null
          this.success = null
          setTimeout(() => {
            this.success = null
          }, 3000)
        }
      } catch (error) {
        console.log(error)
        this.success = null
        this.info = null
        this.error = error.response.data.error
      }
    }
  },
  mixins: [
    AdminLogout
  ]
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
