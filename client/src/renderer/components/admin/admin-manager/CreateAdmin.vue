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
        <v-form
          @submit.prevent="registerAdmin"
          enctype="multipart/form-data"
          class="register-admin-form"
        >
          <!-- TODO: Show required fields -->
          <!-- TODO: Show errors next by their error fields -->
          <h3>Username:</h3>
          <v-flex xs12 sm8 d-flex>
            <v-text-field
              maxlength="20"
              type="text"
              v-model="username"
              solo
            ></v-text-field>
          </v-flex>

          <h3>
            Password:
            <div
              class="passwordStrengthMessage"
              v-if="showMessage"
              v-bind:class="{
                strong : passwordStrength === 'strong',
                weak : passwordStrength === 'weak',
                medium: passwordStrength === 'medium'
              }"
              >
                <p class="pwMessageText">{{passwordStrengthText}}</p>
              </div>
          </h3>
          <v-flex xs12 sm8 d-flex>
            <v-text-field
              @input="analyzePasswordStrength(password), isPasswordConfirmed(password2)"
              maxlength="32"
              type="password"
              v-model="password"
              solo
            ></v-text-field>
          </v-flex>

          <h3>
            Confirm password:
            <div
              class="confirmPasswordMessage"
              v-if="showMessage"
              v-bind:class="{
                passwordMatched : confirmPasswordMatched === true,
                passwordWrong : confirmPasswordMatched === false
              }"
            >
              <p class="pwMessageText">{{isPasswordConfirmedText}}</p>
            </div>
            <!-- TODO: Add icons for match/fail <v-icon>check_box</v-icon> -->
          </h3>
          <v-flex xs12 sm8 d-flex>
            <v-text-field
              @input="isPasswordConfirmed(password2)"
              maxlength="32"
              type="password"
              v-model="password2"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Full name:</h3>
          <v-flex xs12 sm8 d-flex>
            <v-text-field
              maxlength="30"
              type="text"
              v-model="name"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Telephone 1:</h3>
          <v-flex xs12 sm8 d-flex>
            <v-text-field
              maxlength="20"
              type="text"
              v-model="telephone1"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Telephone 2:</h3>
          <v-flex xs12 sm8 d-flex>
            <v-text-field
              maxlength="20"
              type="text"
              v-model="telephone2"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Address:</h3>
          <v-flex xs12 sm8 d-flex>
            <v-text-field
              maxlength="40"
              type="text"
              v-model="address"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Note:</h3>
          <v-flex xs12 sm8 d-flex>
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
      showMessage: false,
      // Password Strength - default
      passwordStrength: 'weak',
      passwordStrengthText: '',
      // Is Password Confirmed - default
      confirmPasswordMatched: false,
      isPasswordConfirmedText: '',
      // Password Regexes ( Password Strength )
      strongRegex: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'),
      mediumRegex: new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'),
      // Messages
      error: null,
      info: null,
      success: null
    }
  },
  methods: {
    analyzePasswordStrength(password) {
      if (this.strongRegex.test(password)) {
        this.passwordStrength = 'strong'
        this.passwordStrengthText = 'Strong password'
        this.showMessage = true
      } else if (this.mediumRegex.test(password)) {
        this.passwordStrength = 'medium'
        this.passwordStrengthText = 'Medium strength'
        this.showMessage = true
      } else if (password === '') {
        this.passwordStrength = 'weak'
        this.passwordStrengthText = ''
        this.showMessage = false
      } else {
        this.passwordStrength = 'weak'
        this.passwordStrengthText = 'Weak password'
        this.showMessage = true
      }
    },
    isPasswordConfirmed(password) {
      if (password === '') {
        this.confirmPasswordMatched = null
        this.isPasswordConfirmedText = ''
      } else if (password === this.password) {
        this.confirmPasswordMatched = true
        this.isPasswordConfirmedText = 'Passwords match'
      } else {
        this.confirmPasswordMatched = false
        this.isPasswordConfirmedText = 'Passwords don\'t match'
      }
    },
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

  .register-admin-form {
    width: 600px;
    max-width: 600px;
    padding: 20px;
  }

  h3 {
    height: 45px;
    display: inline-block;
    width: 370px;
    vertical-align: text-bottom;
  }

  .passwordStrengthMessage {
    float: right;
    width: 170px;
    height: 30px;
    padding-top: 3px;
    text-align: center;
    font-size: 13px;
    border-radius: 15px;

    .pwMessageText {
      display: table;
      margin: 3px auto;
      text-align: center;
      font-weight: 600;
    }
  }
  .strong {
    background-color: lighten(green, 35);
  }
  .medium {
    background-color: lighten(orange, 20);
  }
  .weak {
    background-color: lighten(red, 25);
  }

  .confirmPasswordMessage {
    float: right;
    width: 170px;
    height: 30px;
    padding-top: 3px;
    // margin-left: 200px;
    text-align: center;
    font-size: 13px;
    font-weight: 400;
    border-radius: 15px;

    .pwMessageText {
      display: table;
      margin: 3px auto;
      text-align: center;
      position: relative;
      font-weight: 600;
    }
  }
  .passwordWrong {
    background-color: lighten(red, 25);
  }
  .passwordMatched {
    text-align: center;
    background-color: lighten(green, 35);
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
