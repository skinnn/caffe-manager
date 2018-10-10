<template>
  <div class="admin-edit-article">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">
              Edit Article: {{article.name}}
            </h1>
            <v-btn @click="logoutAdmin" class="logout-btn pink">
              Logout
            </v-btn>
        </div>
      </v-flex>

      <v-flex class="admin-container">

        <div class="admin-edit-storage">
          <v-form
            @submit.prevent="saveArticle(article._id)"
            enctype="multipart/form-data"
          >
            <label>Article name:</label>
            <v-text-field
              type="text"
              v-model="article.name"
              outline
            ></v-text-field>

            <label>Article quantity:</label>
            <v-text-field
              type="number"
              v-model="article.quantity"
              outline
            ></v-text-field>

            <label>Article price:</label>
            <v-text-field
              type="number"
              v-model="article.price"
              outline
            ></v-text-field>

            <label>Last time updated:</label>
            <v-text-field
              type="text"
              v-model="article.updated_date"
              outline
              readonly
            ></v-text-field>

            <div class="upload-image">
              <label>Add Image</label>
              <input id="articleImage" type="file" name="imageUpload" />
            </div>

            <!-- Display messages -->
            <div class="error-msg" v-if="error" v-html="error" />
            <div class="success-msg" v-if="success" v-html="success" />

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
      articleId: this.$store.state.route.params.articleId,
      storageId: this.$store.state.route.params.storageId,
      article: {},
      // Messages
      error: null,
      info: null,
      success: null
    }
  },
  async mounted() {
    try {
      let articleId = this.articleId
      let storageId = this.storageId
      const response = (await ArticleService.getArticleById(articleId, storageId)).data
      if (response.article) {
        this.article = response.article
      }
    } catch (error) {
      this.success = null
      this.info = null
      this.error = error.response.data.error
    }
  },
  methods: {
    async saveArticle(articleId) {
      try {
        const articleFormData = new FormData()
        // Get Article id
        const articleId = this.articleId
        // Get image
        const imagefile = document.querySelector('#articleImage')
        const newImage = imagefile.files[0]
        // Get and append text inputs to form data
        const newArticleName = this.article.name
        const newArticlePrice = this.article.price
        const newArticleQuantity = this.article.quantity
        // Append everything to form data
        articleFormData.append('imageUpload', newImage)
        articleFormData.append('articleName', newArticleName)
        articleFormData.append('articlePrice', newArticlePrice)
        articleFormData.append('articleQuantity', newArticleQuantity)

        // Update Article
        const response = (await ArticleService.saveArticle(articleFormData, articleId)).data
        // If successfully updated the article
        if (response.saved) {
          // Success message
          this.error = null
          this.info = null
          this.success = response.success
          setTimeout(() => {
            this.success = null
          }, 3000)
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

  .admin-edit-storage {
    width: 100%;
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
