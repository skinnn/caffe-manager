<template>
  <div class="admin-view-storage">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">
              Storage: {{storage.name}}
              <v-btn @click="getCreateArticlePage(storage._id)" class="green">
                Add Article
              </v-btn>
              <v-btn @click="editStorage(storage._id)" class="yellow">
                Edit
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

        <!-- Storage data-->
          <h3>Storage info:</h3>
          <p>STORAGE ID: {{storage._id}} </p>
          <hr>
          <br>

          <!-- Articles from the current storage -->
          <div class="list-of-articles">
            <v-list two-line>
              <v-list-tile
                class="single-article-tile"
                v-for="article in this.articles"
                :key="article._id"
                @click="viewArticle(article._id)"
              >

                <v-list-tile-action>
                  <v-icon class="act"></v-icon>
                </v-list-tile-action>

                <v-list-tile-content class="list-tile-text">
                  <v-list-tile-title class="list-title">{{article.name}}</v-list-tile-title>
                  <v-list-tile-sub-title class="list-subtitle">Quantity: {{article.quantity}}</v-list-tile-sub-title>
                  <v-list-tile-sub-title class="list-subtitle">Price: {{article.price}} RSD</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>

          </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import AuthenticationService from '@/services/AuthenticationService'
import StorageService from '@/services/StorageService'
import ArticleService from '@/services/ArticleService'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      storage: {},
      articles: [],
      error: null,
      success: null
    }
  },
  async mounted() {
    try {
      // Get Storage data
      const storageId = this.$store.state.route.params.storageId
      const response = (await StorageService.getStorageById(storageId)).data
      if (response.storage) {
        this.storage = response.storage
      }

      // Get artilces from the current storage
      const res = (await ArticleService.getArticlesByStorageId(storageId)).data
      if (res.articles) {
        this.articles = res.articles
      }
    } catch (error) {
      this.success = null
      this.error = error.response.data.error
    }
  },
  methods: {
    getCreateArticlePage(storageId) {
      this.$router.push({name: 'admin-create-article', params: {storageId}})
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
    },
    editStorage(storageId) {
      this.$router.push({name: 'admin-edit-storage', params: {storageId}})
    }
  }
}
</script>

<style scoped lang="scss">

  .list-of-articles {
    width: 100%;
    padding: 5px;

    .act {
      margin-left: 5px;
      height: 70px;
      width: 75px;
      background-color: grey;
      border: 1px solid black;
      border-radius: 5px;
    }
    .single-article-tile {
      min-height: 75px;
      margin-bottom: 5px;
    }
    .list-tile-text {
      padding: 4px;
      margin-left: 10px;
    }
    .list-title {
      font-size: 18px;
    }
    .list-subtitle {
      font-size: 16px;
    }
  }

  .logout-btn {
    margin-right: 10px;
    position: fixed;
    top: 25px;
    left: 91%;
    color: white;
  }

</style>
