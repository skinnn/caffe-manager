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
          <!--TODO fix error where admin is defined as null -->

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
          ></v-text-field>

        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import AuthenticationService from '@/services/AuthenticationService'
import ArticleService from '@/services/StorageService'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      article: {},
      error: null,
      success: null
    }
  },
  async mounted() {
    try {
      const articleId = this.$store.state.route.params.articleId
      const response = (await ArticleService.getArticleById(articleId)).data

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
        // eslint-disable-next-line
        const response = (await ArticleService.saveArticle(this.article)).data
        this.$router.push({
          name: 'admin-view-article',
          params: {articleId}
        })
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
