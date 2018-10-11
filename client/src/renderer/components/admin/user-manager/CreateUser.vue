<template>
  <div class="admin-edit">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">
              Create Staff Member Account
            </h1>
            <v-btn @click="logoutAdmin" class="logout-btn pink">
              Logout
            </v-btn>
        </div>
      </v-flex>

      <v-flex class="admin-container">
        <v-form @submit.prevent="registerUser" enctype="multipart/form-data">

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
          <div
            class="pwStrength"
            v-bind:class="{
              strong : passwordStrength === 'strong',
              weak : passwordStrength === 'weak',
              medium: passwordStrength === 'medium'
            }"
            ></div>
          <v-flex xs12 sm6 d-flex>
            <v-text-field
              @input="analyzePasswordStrength(password)"
              maxlength="32"
              type="text"
              v-model="password"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Confirm password:</h3>
          <v-flex xs12 sm6 d-flex>
            <v-text-field
              maxlength="32"
              type="text"
              v-model="password2"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Full name:</h3>
          <v-flex xs12 sm6 d-flex>
            <v-text-field
              maxlength="32"
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

          <h3 class="mt-4">Permissions</h3>
          <v-checkbox
            :label="`Warehouse - ${userMenu.warehouse.toString()}`"
            v-model="userMenu.warehouse"
          ></v-checkbox>
          <v-checkbox
            :label="`Tables - ${userMenu.tables.toString()}`"
            v-model="userMenu.tables"
          ></v-checkbox>

          <h3>Add image</h3>
          <br>
          <div class="upload-image">
            <input id="userImage" type="file" name="imageUpload" />
          </div>
          <br>

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
// Components
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
      passwordStrength: 'weak',
      // Password Regexes
      // eslint-disable-next-line
      strongRegex: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'),
      mediumRegex: new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'),
      // Messages
      info: null,
      error: null,
      success: null
    }
  },
  methods: {
    analyzePasswordStrength(password) {
      // console.log(this.password)
      // eslint-disable-next-line
      // const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})')
      // const mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})')
      if (this.strongRegex.test(password)) {
        this.passwordStrength = 'strong'
      } else if (this.mediumRegex.test(password)) {
        this.passwordStrength = 'medium'
      } else {
        this.passwordStrength = 'weak'
      }
    },
    async registerUser() {
      try {
        const userFormData = new FormData()
        // Get image
        const imagefile = document.querySelector('#userImage')
        let image = imagefile.files[0]
        // Get and append text inputs to form data
        const username = this.username
        const password = this.password
        const password2 = this.password2
        const fullName = this.name

        const telephone1 = this.telephone1
        const telephone2 = this.telephone2
        const address = this.address
        const note = this.note

        // Permisions - user menu
        const userMenu = {
          home: this.userMenu.home,
          warehouse: this.userMenu.warehouse,
          tables: this.userMenu.tables
        }
        // Created By
        const createdBy = this.createdBy
        // Append everything to form data
        await userFormData.append('imageUpload', image)
        await userFormData.append('userUsername', username)
        await userFormData.append('userName', fullName)
        await userFormData.append('userPassword', password)
        await userFormData.append('userPassword2', password2)
        await userFormData.append('userTelephone1', telephone1)
        await userFormData.append('userTelephone2', telephone2)
        await userFormData.append('userAddress', address)
        await userFormData.append('userNote', note)
        await userFormData.append('userMenu', userMenu)
        await userFormData.append('createdBy', createdBy)

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
          this.telephone1 = ''
          this.telephone2 = ''
          this.address = ''
          this.note = ''
          image = ''
          this.userMenu.home = true
          this.userMenu.warehouse = false
          this.userMenu.tables = false
        }
      } catch (error) {
        console.log(error)
        this.success = ''
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

  .strong {
    background-color: green;
  }

  .medium {
    background-color: orange;
  }

  .weak {
    background-color: red;
  }

  .pwStrength {
    width: 100px;
    height: 25px;
    margin: 5px 10px 5px 10px;
  }

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
