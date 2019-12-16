<template>
  <div class="admin-view-storage">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
            <h1 class="heading">
              {{subgroup.name}}
              <v-btn @click="createArticlePage(storage._id, subgroup._id, subgroup.name)" class="green">
                Add Article
              </v-btn>
              <v-btn @click="editArticleSubgroupPage(storage._id, subgroup._id)" class="yellow">
                Edit
              </v-btn>
            </h1>
            <admin-logout-btn />
        </div>
      </v-flex>

      <v-flex class="admin-container">
        <!-- Display messages -->
        <div class="error-msg" v-if="error" v-html="error" />
        <div class="success-msg" v-if="success" v-html="success" />
        <div class="info-msg" v-if="info" v-html="info" />

        <!-- Storage data-->
          <h3>Storage info:</h3>
          <p>STORAGE ID: {{storage._id}} </p>

          <v-select
            v-model="pagination.itemsPerPage"
            :items="pagination.selectItemsPerPage"
            @change="changePagination"
            label="Items per page"
            class="pagination-items-per-page"
            required
          ></v-select>
          <hr>
          <br>

          <!-- TODO: Add animation for fetching/displaying Articles possibly with Scroll Reveal -->
          <!-- TODO: Create pagination and limit fetching Articles with ~20 per page -->
          <!-- Articles from the current storage -->
          <v-pagination
            v-if="pagination.totalPages !== null && pagination.totalPages !== 0"
            v-model="pagination.currentPage"
            :length="pagination.totalPages"
            @input="pageChanged"
          ></v-pagination>
          <div id="list-div">

            <v-data-table
              :headers="headers"
              :items="displayedArticles"
              hide-actions
              class="elevation-1"
              dark
            >
              <template slot="items" slot-scope="props">
                <td class="td text-xs-left">
                  <img class="article-image" v-if="props.item.image" :src="`http://localhost:9090/${props.item.image}`" />
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
                    {{ props.item.price }} <span class="currency">{{settings.currency}}</span>
                  </span>
                </td>
                <td class="td text-xs-right">
                  <v-btn @click="editArticlePage(props.item._id)" class="edit-btn yellow">Edit</v-btn>
                  <v-btn @click="deleteArticle(props.item._id, props.item)" class="delete-btn white">Delete</v-btn>
                </td>
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

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      subgroup: {
        _id: this.$store.state.route.params.subgroup._id,
        name: this.$store.state.route.params.subgroup.name
      },
      displayedArticles: [],
      pagination: {
        currentPage: 1,
        totalPages: null,
        itemsPerPage: 20,
        selectItemsPerPage: [
          1,
          5,
          20,
          50,
          80
        ]
      },
      storage: {},
      storageId: this.$store.state.route.params.storageId,
      articles: [],
      settings: {
        currency: this.$store.state.settings.currency
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
      // Message
      error: null,
      success: null,
      info: null
    }
  },
  async mounted() {
    try {
      console.log('Subgroup _id: ', this.subgroup._id)
      console.log('Subgroup name: ', this.subgroup.name)
      let storageId = this.storageId
      // Get Storage data
      const response = (await StorageService.getStorageById(storageId)).data
      if (response.storage) {
        this.storage = response.storage
      }

      // Get Articles from the selected Subgroup
      const res = (await ArticleService.getArticlesBySubgroupId(this.subgroup._id)).data
      console.log('ArticlesBySubgroupId: ', res)

      if (res.articles) {
        this.articles = await res.articles
        let l = this.articles.length
        let s = this.pagination.itemsPerPage
        this.pagination.totalPages = await Math.floor(l / s)
        let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
        let end = start + this.pagination.itemsPerPage
        // Set Displayed Articles
        this.displayedArticles = this.articles.slice(start, end)
      }
    } catch (error) {
      this.success = null
      this.error = error.response.data.error
    }
  },
  methods: {
    changePagination() {
      let l = this.articles.length
      let s = this.pagination.itemsPerPage
      this.pagination.totalPages = Math.floor(l / s)
      let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
      let end = start + this.pagination.itemsPerPage
      // Set Displayed Articles
      this.displayedArticles = this.articles.slice(start, end)
      console.log(this.pagination.itemsPerPage)
    },
    createArticlePage(storageId, subgroupId, subgroupName) {
      this.$router.push({name: 'admin-create-article', params: {storageId, subgroupId, subgroupName}})
    },
    editArticleSubgroupPage(subgroupId) {
      // TODO: Edit Article Subgroup
      this.$router.push({name: 'admin-edit-article-subgroup', params: {subgroupId}})
    },
    editArticlePage(articleId) {
      let storageId = this.storageId
      this.$router.push({name: 'admin-edit-article', params: {articleId, storageId}})
    },

    async pageChanged() {
      try {
        let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
        let end = start + this.pagination.itemsPerPage
        // Change Displayed Articles
        this.displayedArticles = this.articles.slice(start, end)
      } catch (error) {
        console.log(error)
      }
    },

    async deleteArticle(articleId, article) {
      let confirmation = await confirm(
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
  }
}
</script>

<style scoped lang="scss">

.admin-container {
  
  .pagination-items-per-page {
    max-width: 120px;
  }
}

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

</style>
