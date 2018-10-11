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
          <!-- TODO: Show required fields -->
          <!-- TODO: Show errors next by their error fields -->
          <h3>Username:</h3>
          <v-flex xs12 sm6 d-flex>
            <v-text-field
              maxlength="20"
              type="text"
              v-model="username"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Password:</h3>
          <v-flex xs12 sm6 d-flex>
            <v-text-field
              maxlength="32"
              type="password"
              v-model="password"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Confirm password:</h3>
          <v-flex xs12 sm6 d-flex>
            <v-text-field
              maxlength="32"
              type="password"
              v-model="password2"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Full name:</h3>
          <v-flex xs12 sm6 d-flex>
            <v-text-field
              maxlength="30"
              type="text"
              v-model="name"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Telephone 1:</h3>
          <v-flex xs12 sm6 d-flex>
            <v-text-field
              maxlength="20"
              type="text"
              v-model="telephone1"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Telephone 2:</h3>
          <v-flex xs12 sm6 d-flex>
            <v-text-field
              maxlength="20"
              type="text"
              v-model="telephone2"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Address:</h3>
          <v-flex xs12 sm6 d-flex>
            <v-text-field
              maxlength="40"
              type="text"
              v-model="address"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Note:</h3>
          <v-flex xs12 sm6 d-flex>
            <v-textarea
              maxlength="250"
              type="text"
              v-model="note"
              placeholder="Write a note..."
              outline
            ></v-textarea>
          </v-flex>

          <h3>Add image</h3>
          <br>
          <div class="upload-image">
            <input id="adminImage" type="file" name="imageUpload" />
          </div>
          <br>

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
      password: '',
      password2: '',
      name: '',
      telephone1: '',
      telephone2: '',
      address: '',
      note: '',
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
          let image = imagefile.files[0]
          // Get and append text inputs to form data
          const adminUsername = this.username
          const adminPassword = this.password
          const adminPassword2 = this.password2
          const adminName = this.name
          const telephone1 = this.telephone1
          const telephone2 = this.telephone2
          const address = this.address
          const note = this.note
          // TODO: Only root_user can create admins
          // Admin who created this admin account
          const createdBy = this.createdBy
          // Append everything to form data
          await adminFormData.append('imageUpload', image)
          await adminFormData.append('adminUsername', adminUsername)
          await adminFormData.append('adminPassword', adminPassword)
          await adminFormData.append('adminPassword2', adminPassword2)
          await adminFormData.append('adminName', adminName)
          await adminFormData.append('telephone1', telephone1)
          await adminFormData.append('telephone2', telephone2)
          await adminFormData.append('address', address)
          await adminFormData.append('note', note)
          await adminFormData.append('createdBy', createdBy)

          // Register admin
          const response = (await AuthenticationService.registerAdmin(adminFormData)).data
          // If registering was successful redirect to the admin list
          if (response.admin) {
            console.log(response)
            // this.$router.push({
            //   name: 'admin-register'
            // })

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
            this.telephone1 = ''
            this.telephone2 = ''
            this.address = ''
            this.note = ''
            image = ''
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
