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
              <v-btn @click="saveArticle(article._id)" class="yellow">
                Save
              </v-btn>
            </h1>
            <v-btn @click="logoutAdmin" class="logout-btn pink">
              Logout
            </v-btn>
        </div>
      </v-flex>

      <v-flex class="admin-container">
        <!-- Display messages -->
        <div class="error-msg" v-if="error" v-html="error" />
        <div class="success-msg" v-if="success" v-html="success" />

        <div class="admin-edit-storage">
          <form>
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
          </form>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import AuthenticationService from '@/services/AuthenticationService'
import ArticleService from '@/services/ArticleService'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      articleId: this.$store.state.route.params.articleId,
      storageId: this.$store.state.route.params.storageId,
      article: {},
      error: null,
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
      this.error = error.response.data.error
    }
  },
  methods: {
    async saveArticle(articleId) {
      try {
        // Save Article
        const response = (await ArticleService.saveArticle(this.article)).data
        // If successfully saved
        if (response.saved) {
          // Success message
          this.error = null
          this.success = response.success
          setTimeout(() => {
            this.success = null
          }, 3000)
        }
      } catch (error) {
        this.success = null
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
