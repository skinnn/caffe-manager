<template>
  <div class="admin-create-article">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">
              Create Article
            </h1>
            <v-btn @click="logoutAdmin" class="logout-btn pink">
              Logout
            </v-btn>
        </div>
      </v-flex>

      <v-flex class="admin-container">
        <v-form @submit.prevent="createArticle" enctype="multipart/form-data">
          <!-- <v-text-field
            type="text"
            name="storageId"
            v-model="storageId"
            label="Storage Id"
            outline
          ></v-text-field>

          <v-text-field
            type="text"
            name="name"
            v-model="name"
            label="Article Name:"
            outline
          ></v-text-field>

          <v-text-field
            type="text"
            name="quantity"
            v-model="quantity"
            label="Quantity:"
            outline
          ></v-text-field>

          <v-text-field
            type="text"
            name="price"
            v-model="price"
            label="Price:"
            outline
          ></v-text-field>

          <v-menu
            origin="center center"
            transition="scale-transition">
            <v-btn
              slot="activator"
              color="primary"
              dark
            > Currency
            </v-btn>

            <v-list>
              <v-list-tile
                v-for="currency in currencies"
                :key="currency.name"
                @click=""
              >
                <v-list-tile-title>{{ currency.sign }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu> -->

          <div class="upload-image">
            <label>Add Image</label>
            <input id="articleImage" type="file" name="imageUpload" />
            <!-- <upload-btn name="articleImage" title="Upload image" accept="image/*" :fileChangedCallback="imagePreview">
              <template slot="icon">
                <v-icon>image</v-icon>
              </template>
            </upload-btn> -->
          </div>

          <button type="submit" class="yellow">
            Create
          </button>
        </v-form>

          <!-- Display messages -->
          <div class="error-msg" v-if="error" v-html="error" />
          <div class="success-msg" v-if="success" v-html="success" />

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import UploadButton from 'vuetify-upload-button'
import AuthenticationService from '@/services/AuthenticationService'
import ArticleService from '@/services/ArticleService'

export default {
  components: {
    AdminSideMenu,
    'upload-btn': UploadButton
  },
  data() {
    return {
      name: '',
      quantity: '',
      price: '',
      // TODO: Create currency
      currencies: [
        {
          title: 'Serbian Dinar',
          code: 'RSD',
          sign: 'din'
        },
        {
          title: 'Euro',
          code: 'EUR',
          sign: '€'
        }
      ],
      storageId: this.$store.state.route.params.storageId,
      error: null,
      success: null
    }
  },
  methods: {
    // imagePreview() {
    //   let files = document.getElementById('uploadFile').files
    //   console.log(files[0])
    // },
    // async upload() {
    //   let files = document.getElementById('uploadFile').files
    //   // let path = files[0].path
    //   console.log(files[0].path)
    //   try {
    //     const res = (await ArticleService.upload({
    //       img: this.img.files,
    //       path: files[0].path
    //     })).data
    //     console.log(res)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    async createArticle() {
      try {
        var formData = new FormData()
        var imagefile = document.querySelector('#articleImage')
        var image = imagefile.files[0]
        console.log(image)
        formData.append('imageUpload', image)

        // var artname = this.name
        // var artprice = this.price
        // var artquantity = this.quantity
        // formData.append('imageUpload', image)
        // formData.append('artname', artname)
        // formData.append('quantity', artquantity)
        // formData.append('price', artprice)

        const response = await ArticleService.createArticle(formData)
        console.log(response)
        // const response = (await ArticleService.createArticle({
        //   storageId: this.storageId,
        //   name: this.name,
        //   quantity: this.quantity,
        //   price: this.price
        // })).data

        // if (response.uploaded) {
        //   // Success message
        //   this.error = null
        //   this.success = response.success
        //   setTimeout(() => {
        //     this.success = null
        //   }, 3000)
        //   // Refresh page
        //   this.$router.push({
        //     name: 'admin-home'
        //   })
        //   // Reset input fields
        //   this.name = ''
        //   this.quantity = ''
        //   this.price = ''
        // }
      } catch (error) {
        console.log(error)
        // this.success = ''
        // this.error = error.response.data.error
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
