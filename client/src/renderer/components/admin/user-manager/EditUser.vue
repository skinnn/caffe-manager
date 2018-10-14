<template>
  <div class="admin-edit-page">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">
              Edit User: {{name.value}}
            </h1>
            <admin-logout-btn />
        </div>
      </v-flex>

      <v-flex class="admin-container">
        <!-- Display messages -->
        <div class="error-msg" v-if="error" v-html="error" />
        <div class="success-msg" v-if="success" v-html="success" />

        <div class="admin-edit">
          <v-form
            @submit.prevent="updateUser"
            enctype="multipart/form-data"
            class="edit-user-form"
          >
            <h3>Username:</h3>
            <v-flex xs12 sm8 d-flex>
              <v-text-field
                title="Required field"
                :error-messages="username.error_message"
                type="text"
                maxlength="15"
                v-model="username.value"
                solo
              ></v-text-field>
            </v-flex>

            <h3>Full name:</h3>
            <v-flex xs12 sm8 d-flex>
              <v-text-field
                title="Required field"
                :error-messages="name.error_message"
                type="text"
                maxlength="32"
                v-model="name.value"
                solo
              ></v-text-field>
            </v-flex>

            <h3>Telephone 1:</h3>
            <v-flex xs12 sm8 d-flex>
              <v-text-field
                :error-messages="telephone1.error_message"
                type="text"
                maxlength="20"
                v-model="telephone1.value"
                solo
              ></v-text-field>
            </v-flex>

            <h3>Telephone 2:</h3>
            <v-flex xs12 sm8 d-flex>
              <v-text-field
                :error-messages="telephone2.error_message"
                type="text"
                maxlength="20"
                v-model="telephone2.value"
                solo
              ></v-text-field>
            </v-flex>

            <h3>Address:</h3>
            <v-flex xs12 sm8 d-flex>
              <v-text-field
                :error-messages="address.error_message"
                maxlength="35"
                type="text"
                v-model="address.value"
                solo
              ></v-text-field>
            </v-flex>

            <h3>Note:</h3>
            <v-flex xs12 sm8 d-flex>
              <v-textarea
                :error-messages="note.error_message"
                maxlength="250"
                type="text"
                v-model="note.value"
                placeholder="Write a short note about the person.."
                outline
              ></v-textarea>
            </v-flex>

            <h3>Image</h3>
            <br>
            <div class="upload-image">
              <input
                type="file"
                @change="imagePreview(this)"
                id="userImage"
                name="imageUpload"
              />
              <img id="previewImg" class="previewImg"
                v-if="image.value && image.value !== ''"
                :src="`http://localhost:8080/${image.value}`"
                alt="">
              <!-- Preview Image placeholder -->
              <img v-if="!image.value && image.value !== ''" class="previewImgPlaceholder" src="" alt="">
            </div>
            <br>

            <v-btn type="submit" class="yellow">
              Save
            </v-btn>
          </v-form>
        </div>

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// Components
import AdminSideMenu from '@/components/admin/AdminSideMenu'
// Services
import AdminService from '@/services/AdminService'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      userId: {
        value: this.$store.state.route.params.userId
      },
      username: {
        value: '',
        error_message: ''
      },
      // password: {
      //   value: '',
      //   success_message: '',
      //   error_message: ''
      // },
      // password2: {
      //   value: '',
      //   success_message: '',
      //   error_message: ''
      // },
      name: {
        value: '',
        error_message: ''
      },
      image: {
        value: ''
      },
      telephone1: {
        value: '',
        error_message: ''
      },
      telephone2: {
        value: '',
        error_message: ''
      },
      address: {
        value: '',
        error_message: ''
      },
      note: {
        value: '',
        error_message: ''
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
      error: null,
      success: null
    }
  },
  async mounted() {
    try {
      const userId = this.userId.value
      const response = (await AdminService.getUserById(userId)).data
      console.log(response)
      if (response.user) {
        const user = response.user
        this.userId.value = user._id
        this.username.value = user.username
        this.name.value = user.name
        this.image.value = user.image
        this.telephone1.value = user.telephone1
        this.telephone2.value = user.telephone2
        this.address.value = user.address
        this.note.value = user.note
      }
    } catch (error) {
      this.success = null
      this.error = error.response.data.error
    }
  },
  methods: {
    imagePreview() {
      const img = document.getElementById('userImage').files
      const previewImg = document.getElementById('previewImg')
      var reader = new FileReader()
      reader.onload = function(e) {
        previewImg.src = e.target.result
      }
      reader.readAsDataURL(img[0])
    },
    async updateUser() {
      try {
        const userId = this.userId.value
        const updatedUser = new FormData()
        // Get image
        let imagefile = document.querySelector('#userImage')
        let image = imagefile.files[0]
        // Get and append text inputs to form data
        const username = this.username.value
        // const password = this.password.value
        // const password2 = this.password2.value
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
        await updatedUser.append('imageUpload', image)
        await updatedUser.append('userUsername', username)
        await updatedUser.append('userName', fullName)
        // await updatedUser.append('userPassword', password)
        // await updatedUser.append('userPassword2', password2)
        await updatedUser.append('userTelephone1', telephone1)
        await updatedUser.append('userTelephone2', telephone2)
        await updatedUser.append('userAddress', address)
        await updatedUser.append('userNote', note)
        await updatedUser.append('userMenu', userMenu)
        await updatedUser.append('createdBy', createdBy)

        const response = (await AdminService.updateUser(userId, updatedUser)).data
        console.log(response)
        this.$router.push({
          name: 'admin-view-user',
          params: {userId}
        })
      } catch (error) {
        console.log(error)

        // Form Messages - Error/Success
        // Username
        if (error.response.data.username_error) {
          this.success = null
          this.info = null
          this.error = error.response.data.username_error
          this.username.error_message = error.response.data.username_error
        } else {
          this.username.error_message = ''
        }
        // // Password
        // if (error.response.data.password_error) {
        //   this.success = null
        //   this.info = null
        //   this.error = error.response.data.password_error
        //   this.password.error_message = error.response.data.password_error
        // } else {
        //   this.password.error_message = ''
        // }
        // // Confirm Password
        // if (error.response.data.password2_error) {
        //   this.success = null
        //   this.info = null
        //   this.error = error.response.data.password2_error
        //   this.password2.error_message = error.response.data.password2_error
        // } else {
        //   this.password2.error_message = ''
        // }
        // Full Name
        if (error.response.data.name_error) {
          this.success = null
          this.info = null
          this.error = error.response.data.name_error
          this.name.error_message = error.response.data.name_error
        } else {
          this.name.error_message = ''
        }
        // Telephone 1
        if (error.response.data.telephone1_error) {
          this.success = null
          this.info = null
          this.error = error.response.data.telephone1_error
          this.telephone1.error_message = error.response.data.telephone1_error
        } else {
          this.telephone1.error_message = ''
        }
        // Telephone 2
        if (error.response.data.telephone2_error) {
          this.success = null
          this.info = null
          this.error = error.response.data.telephone2_error
          this.telephone2.error_message = error.response.data.telephone2_error
        } else {
          this.telephone2.error_message = ''
        }
        // Address
        if (error.response.data.address_error) {
          this.success = null
          this.info = null
          this.error = error.response.data.address_error
          this.address.error_message = error.response.data.address_error
        } else {
          this.address.error_message = ''
        }
        // Note
        if (error.response.data.note_error) {
          this.success = null
          this.info = null
          this.error = error.response.data.note_error
          this.note.error_message = error.response.data.note_error
        } else {
          this.note.error_message = ''
        }
        // User Menu - Privileges
        if (error.response.data.menu_error) {
          this.success = null
          this.info = null
          this.error = error.response.data.menu_error
        }
        // Created By
        if (error.response.data.created_by_error) {
          this.success = null
          this.info = null
          this.error = error.response.data.created_by_error
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">

  .admin-edit {
    width: 100%;

    .edit-user-form {
      width: 600px;
      max-width: 600px;
      padding: 20px;

      .previewImg {
        min-width: 150px;
        min-height: 150px;
        max-width: 300px;
        max-height: 300px;
        border: 1px solid orange;
        border-radius: 3px;
        margin: 10px 0 0 10px;
        display: block;
      }

      .previewImgPlaceholder {
        width: 150px;
        height: 150px;
        border: 1px solid orange;
        border-radius: 3px;
        margin: 10px 0 0 10px;
        display: block;
      }

      .previewImgInput {
        margin: 5px 0 0 10px;
      }
    }
  }

  .list-title {
    font-size: 17px;
  }

</style>
