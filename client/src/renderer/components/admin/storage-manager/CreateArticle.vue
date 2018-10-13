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
          <v-text-field
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
            label="Article name:"
            outline
          ></v-text-field>

          <v-text-field
            type="number"
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

          <v-text-field
            type="text"
            name="price"
            v-model="retail_price"
            label="Retail price:"
            outline
          ></v-text-field>

          <div class="upload-image">
            <label>Add Image</label>
            <input id="articleImage" type="file" name="imageUpload" />
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
import ArticleService from '@/services/ArticleService'
// Global Mixins
import AdminLogout from '@/mixins/AdminLogout'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      storageId: this.$store.state.route.params.storageId,
      name: '',
      quantity: 0,
      price: 0,
      retail_price: 0,
      error: null,
      success: null
    }
  },
  methods: {
    // TODO: Add image preview
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
        // TODO: Don't make a req to the server if quantity or name fields are not filled
        const formData = new FormData()
        // Get image
        const imagefile = document.querySelector('#articleImage')
        const image = imagefile.files[0]
        // Get and append text inputs to form data
        const artName = this.name
        const artPrice = this.price
        const artRetailPrice = this.retail_price
        const artQuantity = this.quantity
        // Storage ID
        const storageId = this.storageId

        // Validation
        if (artName !== '' && artName !== undefined) {
          if (artPrice !== 0 && artPrice !== '' && artPrice !== null && artPrice !== undefined) {
            if (artQuantity !== 0 && artQuantity !== '' && artQuantity !== null && artQuantity !== undefined) {
              // Append everything to form data
              formData.append('imageUpload', image)
              formData.append('storageId', storageId)
              formData.append('articleName', artName)
              formData.append('articlePrice', artPrice)
              formData.append('articleRetailPrice', artRetailPrice)
              formData.append('articleQuantity', artQuantity)

              // Create article
              const response = (await ArticleService.createArticle(formData)).data

              // If successfully created
              if (response.created) {
                // Success message and timeout
                this.error = null
                this.success = response.success
                setTimeout(() => {
                  this.success = null
                }, 3000)
                // Reset input fields
                this.name = ''
                this.quantity = 0
                this.price = 0
                this.retail_price = 0
              }
            } else {
              this.success = null
              this.info = null
              this.error = 'Article must have a quantity.'
              return
            }
          } else {
            this.success = null
            this.info = null
            this.error = 'Article must have a price.'
            return
          }
        } else {
          this.success = null
          this.info = null
          this.error = 'Article must have a name.'
          return
        }
      } catch (error) {
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
