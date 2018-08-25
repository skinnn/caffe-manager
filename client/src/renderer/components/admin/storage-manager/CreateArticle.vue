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
          <v-text-field
            type="text"
            v-model="name"
            label="Article Name:"
            outline
          ></v-text-field>

          <v-text-field
            type="text"
            v-model="quantity"
            label="Quantity:"
            outline
          ></v-text-field>

          <v-text-field
            type="text"
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
          </v-menu>

          <!-- Display messages -->
          <div class="error-msg" v-if="error" v-html="error" />
          <div class="success-msg" v-if="success" v-html="success" />

          <v-btn @click="createArticle()" class="yellow">
            Create
          </v-btn>

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
    async createArticle() {
      try {
        // Get id of storage where article is created
        // const storageId = this.$store.state.route.params.storageId

        const response = (await ArticleService.createArticle(this.storageId, {
          name: this.name,
          quantity: this.quantity,
          price: this.price
        })).data

        if (response.saved) {
          // Success message
          this.error = null
          this.success = response.success
          setTimeout(() => {
            this.success = null
          }, 3000)

          // Reset input fields
          this.name = ''
          this.quantity = ''
          this.price = ''
        }
      } catch (error) {
        console.log(error)
        this.success = ''
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
