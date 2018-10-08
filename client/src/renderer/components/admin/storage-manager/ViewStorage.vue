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
              <v-btn @click="createArticlePage(storage._id)" class="green">
                Add Article
              </v-btn>
              <v-btn @click="editStoragePage(storage._id)" class="yellow">
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

          <!-- TODO: Add animation for fetching/displaying Articles possibly with Scroll Reveal -->
          <!-- TODO: Create pagination and limit fetching Articles with ~20 per page -->
          <!-- Articles from the current storage -->
          <div id="list-div">

            <v-data-table
              :headers="headers"
              :items="articles"
              hide-actions
              class="elevation-1"
              dark
            >
              <template slot="items" slot-scope="props">
                <td class="td text-xs-left">
                  <img class="article-image" v-if="props.item.image" :src="`http://localhost:8080/${props.item.image}`" />
                </td>
                <td class="td text-xs-left">
                  <span class="article-name">
                    {{ props.item.name }}
                  </span>
                </td>
                <td class="td text-xs-left">
                  <span class="article-quantity">
                    {{ props.item.quantity }}
                  </span>
                </td>
                <td class="td text-xs-left">
                  <span class="article-price">
                    {{ props.item.price }} <span class="currency">{{currency.serbianDinar}}</span>
                  </span>
                </td>
                <td class="td text-xs-right">
                  <v-btn @click="editArticlePage(props.item._id)" class="edit-btn yellow">Edit</v-btn>
                  <v-btn @click="deleteArticle(props.item._id, props.item)" class="delete-btn white">Delete</v-btn>
                </td>
                <!-- <td class="td text-xs-right delete-td">

                </td> -->
              </template>
            </v-data-table>

          </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import StorageService from '@/services/StorageService'
import ArticleService from '@/services/ArticleService'
// Global Mixins
import AdminLogout from '@/mixins/AdminLogout'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      storage: {},
      storageId: this.$store.state.route.params.storageId,
      articles: [],
      currency: {
        euro: '€',
        serbianDinar: 'RSD',
        dollar: '$',
        pound: '£'
      },
      headers: [
        {
          text: '',
          align: 'left',
          sortable: false,
          value: 'image'
        },
        { text: 'Name', value: 'name' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Price', value: 'price' },
        { text: 'Options', sortable: false, align: 'center', value: 'option' }
      ],
      error: null,
      success: null
    }
  },
  async mounted() {
    try {
      let storageId = this.storageId
      // Get Storage data
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
    createArticlePage(storageId) {
      this.$router.push({name: 'admin-create-article', params: {storageId}})
    },
    editStorage(storageId) {
      this.$router.push({name: 'admin-edit-storage', params: {storageId}})
    },
    editArticlePage(articleId) {
      let storageId = this.storageId
      this.$router.push({name: 'admin-edit-article', params: {articleId, storageId}})
    },
    async deleteArticle(articleId, article) {
      let confirmation = confirm(
        'Are you sure?'
      )
      if (confirmation) {
        try {
          // Get path for the article image
          const imgPath = article.image
          // Delete article
          const response = (await ArticleService.deleteArticle(articleId, imgPath)).data
          // If Article is deleted successfully
          if (response.deleted) {
            // Set success message and timeout
            this.error = null
            this.success = response.success
            setTimeout(() => {
              this.success = null
            }, 3000)

            // Reset Article list after deleting
            let storageId = this.storageId
            const ress = (await ArticleService.getArticlesByStorageId(storageId)).data
            if (ress.articles) {
              this.articles = ress.articles
            }
          }
        } catch (error) {
          this.success = null
          this.error = error.response.data.error
        }
      }
    }
  },
  mixins: [
    AdminLogout
  ]
}
</script>

<style scoped lang="scss">

  #list-div {
    width: 100%;
    padding: 5px;

    .td {
      height: 75px;
      cursor: pointer;
    }
    .article-image {
      max-width: 100px;
      max-height: 90px;
      padding-top: 4px;
      margin-left: 5px;
    }
    .article-name {
      font-weight: 600;
      font-size: 16px;
    }
    .article-quantity {
      font-size: 16px;
    }
    .article-price {
      font-size: 16px;
      color: white;
    }
    .currency {
      font-size: 13px;
      color: white;
    }
    .edit-td {
      // max-width: 80px;
    }
    .delete-td {
      // max-width: 80px;
    }
    .edit-btn {
      color: black;
      font-size: 15px;
    }
    .delete-btn {
      color: red;
      font-size: 15px;
      border: 1px solid red;
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
