<template>
  <div class="admin-create-user">
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
        <v-form
          @submit.prevent="registerUser"
          enctype="multipart/form-data"
          class="register-user-form"
        >
        <!-- TODO: Show required fields -->
        <!-- TODO: Show errors next by their error fields -->
          <h3>Username:</h3>
          <v-flex xs12 sm8 d-flex>
            <v-text-field
              :success-messages="username.success_messages"
              :error-messages="username.error_messages"
              maxlength="15"
              type="text"
              v-model="username.value"
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
              :success-messages="password.success_messages"
              :error-messages="password.error_messages"
              maxlength="32"
              type="password"
              v-model="password.value"
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
              <!-- TODO: Add icons for match/fail <v-icon>check_box</v-icon> -->
            </div>
          </h3>
          <v-flex xs12 sm8 d-flex>
            <v-text-field
              @input="isPasswordConfirmed(password2)"
              :success-messages="password2.success_messages"
              :error-messages="password2.error_messages"
              maxlength="32"
              type="password"
              v-model="password2.value"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Full name:</h3>
          <v-flex xs12 sm8 d-flex>
            <v-text-field
              :success-messages="name.success_messages"
              :error-messages="name.error_messages"
              maxlength="32"
              type="text"
              v-model="name.value"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Telephone 1:</h3>
          <v-flex xs12 sm8 d-flex>
            <v-text-field
              :success-messages="telephone1.success_messages"
              :error-messages="telephone1.error_messages"
              maxlength="20"
              type="text"
              v-model="telephone1.value"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Telephone 2:</h3>
          <v-flex xs12 sm8 d-flex>
            <v-text-field
              :success-messages="telephone2.success_messages"
              :error-messages="telephone2.error_messages"
              maxlength="20"
              type="text"
              v-model="telephone2.value"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Address:</h3>
          <v-flex xs12 sm8 d-flex>
            <v-text-field
              :success-messages="address.success_messages"
              :error-messages="address.error_messages"
              maxlength="35"
              type="text"
              v-model="address.value"
              solo
            ></v-text-field>
          </v-flex>

          <h3>Note:</h3>
          <v-flex xs12 sm8 d-flex>
            <v-textarea
              :success-messages="note.success_messages"
              :error-messages="note.error_messages"
              maxlength="250"
              type="text"
              v-model="note.value"
              placeholder="Write a short note about the user.."
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
      username: {
        value: '',
        success_messages: ['Success username test'],
        error_messsages: ['Error username test']
      },
      password: {
        value: '',
        success_messages: ['Success password test'],
        error_messsages: ['Error password test']
      },
      password2: {
        success_messages: ['Success confirm password test'],
        error_messsages: ['Error confirm password test']
      },
      name: {
        value: '',
        success_messages: ['Success name test'],
        error_messsages: ['Error name test']
      },
      telephone1: {
        value: '',
        success_messages: ['Success telephone 1 test'],
        error_messsages: ['Error telephone 1 test']
      },
      telephone2: {
        value: '',
        success_messages: ['Success telephone 2 test'],
        error_messsages: ['Error telephone 2 test']
      },
      address: {
        value: '',
        success_messages: ['Success address test'],
        error_messsages: ['Error address test']
      },
      note: {
        value: '',
        success_messages: ['Success note test'],
        error_messsages: ['Error note test']
      },
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
      info: null,
      error: null,
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
    async registerUser() {
      try {
        const userFormData = new FormData()
        // Get image
        let imagefile = document.querySelector('#userImage')
        let image = imagefile.files[0]
        // Get and append text inputs to form data
        const username = this.username.value
        const password = this.password.value
        const password2 = this.password2.value
        const fullName = this.name.value
        const telephone1 = this.telephone1.value
        const telephone2 = this.telephone2.value
        const address = this.address.value
        const note = this.note.value

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
          this.username.value = ''
          this.password.value = ''
          this.password2.value = ''
          this.name.value = ''
          this.telephone1.value = ''
          this.telephone2.value = ''
          this.address.value = ''
          this.note.value = ''
          this.userMenu.home = true
          this.userMenu.warehouse = false
          this.userMenu.tables = false
          image = ''
          imagefile.value = ''
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

  .register-user-form {
    width: 600px;
    max-width: 600px;
    padding: 20px;

    h3 {
      height: 40px;
      display: inline-block;
      width: 370px;
    }

    .passwordStrengthMessage {
      float: right;
      width: 170px;
      height: 30px;
      // padding-top: 3px;
      text-align: center;
      font-size: 13px;
      border-radius: 15px;

      .pwMessageText {
        display: table;
        margin: 6px auto;
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
      text-align: center;
      font-size: 13px;
      border-radius: 15px;

      .pwMessageText {
        display: table;
        margin: 6px auto;
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
