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
          <div id="list-div">

            <v-data-table
              :headers="headers"
              :items="articles"
              hide-actions
              class="elevation-1"
              dark
            >
              <template slot="items" slot-scope="props">
                <td class="td text-xs-left">{{ props.item.image }}</td>
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
                <td class="td text-xs-right edit-td">
                  <v-btn @click="" class="edit-btn yellow">Edit</v-btn>
                </td>
                <td class="td text-xs-right delete-td">
                  <v-btn @click="" class="delete-btn white">Delete</v-btn>
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
      currency: {
        euro: '€',
        serbianDinar: 'RSD',
        dollar: '$',
        pound: '£'
      },
      headers: [
        {
          text: 'Image',
          align: 'left',
          sortable: false,
          value: 'image'
        },
        { text: 'Name', value: 'name' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Price', value: 'price' }
      ],
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

  #list-div {
    width: 100%;
    padding: 5px;

    .td {
      height: 75px;
      cursor: pointer;
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
      max-width: 80px;
    }
    .delete-td {
      max-width: 80px;
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
