<template>
  <div class="admin-tables">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
          <h1 v-if="!currentTable" class="heading">Tables</h1>
          <!-- Current Table Heading -->
          <h1 v-if="currentTable" class="heading">
            <v-btn @click="deleteTable(currentTable._id)" class="delete-btn pink">
              Delete
            </v-btn>
            Table
            <div class="circleDiv">
              <div class="tableNumber">{{currentTable.number}}</div>
            </div>
          </h1>
          <!-- ./ Current Table Heading -->
          <v-btn @click="logoutAdmin" class="logout-btn pink">
            Logout
          </v-btn>
        </div>
      </v-flex>

      <v-flex class="admin-container">
        <!-- Display messages -->
        <div class="error-msg" v-if="error" v-html="error" />
        <div class="success-msg" v-if="success" v-html="success" />
        <div class="info-msg" v-if="info" v-html="info" />

        <!-- TODO: Should also somewhere list all the tables by their owners/users -->
        <div class="container">

          <!-- Reserve Article Menu -->
          <div v-if="articleMenu" class="reserve-article-menu">
            <!-- Selected Articles -->
            <div v-if="selectedArticles != 0" class="selectedArticles">
              <h3>Selected articles</h3>
              <ul class="selectedArticleList">
                <li
                  v-for="article in this.selectedArticles"
                  :key="article._id"
                  class="selectedArticleLi"
                >
                  <span class="selectedArticleName">
                    {{article.name}}
                  </span>
                  <div class="articleQuantity">{{article.quantity}}</div>
                  <button @click="removeSelectedArticle(article.selectedId)" class="removeSelectedArticleBtn">
                    <v-icon class="closeIcon">close</v-icon>
                  </button>
                </li>
              </ul>
            </div>
            <ul class="articleMenuList">
              <h2 class="articleMenuHeading">Select articles</h2>
              <li
                v-for="article in this.articleList"
                :key="article._id"
                @click="selectArticle(article.name, article._id)"
                class="singleArticleMenuLi"
              >
                <img
                  v-if="article.image"
                  :src="`http://localhost:8080/${article.image}`"
                  class="articleMenuImage"
                  alt="No image"
                >
                <!-- Placeholder if there is no article image -->
                <div v-if="!article.image" class="articleMenuImage"></div>
                <div class="singleArticleMenuInfo">
                  <p class="info-text info-name">{{article.name}}</p>
                  <p class="info-text">Quantity: {{article.quantity}}</p>
                  <p class="info-text">Price: {{article.price}} {{currency}}</p>
                </div>
              </li>
              <v-btn
                class="articleMenuFinishBtn"
                @click="finishReserving"
              >
                Finish
              </v-btn>
            </ul>
          </div>

          <!-- Current Table Content -->
          <div v-if="currentTable && !articleMenu" class="currentTable">
            <p>Number: <span class="currentTableNumber">{{currentTable.number}}</span></p>
            <div class="createOrder">
              <v-text-field
                type="text"
                v-model="newOrderName"
                label="Order:"
                outline
              ></v-text-field>
              <v-btn
                @click="createOrder(currentTable._id)"
                >
                  New Order
                  <v-icon>add</v-icon>
              </v-btn>
            </div>

            <div class="orders">
              <ul class="order-list">
                <li
                  v-for="order in this.currentTableOrders"
                  :key="order._id"
                  @click=""
                  class="singleOrderLi"
                >
                <div class="singleOrderDiv">
                  <div class="orderHeading">
                    <span class="orderName">{{order.name}}</span>
                    <hr />
                    <v-btn @click="deleteOrder(order._id, currentTable._id)" class="deleteOrderBtn" small fab>
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </div>
                  <div>
                    <v-btn
                      class="addArticleBtn"
                      @click="openArticleMenu(order._id)"
                    >
                      Add article
                    </v-btn>
                  </div>
                </div>
                </li>
              </ul>
            </div>
          </div> <!-- ./ Current Table Content -->

          <!-- List of tables -->
          <ul v-if="!articleMenu" id="listOfTables" class="listOfTables collection">
            <p class="tablesListText">List of Tables</p>
            <hr>

            <!-- List of tables from the current user -->
            <li
              v-for="table in this.tables"
              :key="table._id"
              @click="viewTable(table._id)"
              class="liSingleTable"
            >
              <span class="singleTableNumber">{{table.number}}</span>
            </li>
            <!-- Create table -->
            <li @click="createTable" class="liCreateTable">
              <v-icon class="createTableIcon">add</v-icon>
            </li>
          </ul>
        </div>

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import AuthenticationService from '@/services/AuthenticationService'
import OrderService from '@/services/OrderService'
import ArticleService from '@/services/ArticleService'
import swal from 'sweetalert2'
import TableService from '@/services/TableService'
import uuidv1 from 'uuid/v1'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      selectedArticles: [],
      // TODO: Get currency from the admin settings
      currency: '$',
      articleList: [],
      articleMenu: false,
      currentTable: null,
      currentTableOrders: [],
      ownerId: this.$store.state.admin._id,
      tables: [],
      newOrderName: '',
      newTable: {
        number: '',
        // TODO: Add owner name and username
        ownerId: ''
      },
      error: null,
      success: null,
      info: null
    }
  },
  watch: {
    // Whenever current table changes, fetch the orders from that table
    currentTable: async function() {
      try {
        const ordersResponse = (await OrderService.getOrdersByTableId(this.ownerId, this.currentTable._id)).data
        console.log(ordersResponse)
        // Reset Order list each time new table is selected
        const orders = this.currentTableOrders = []
        // Add orders in the orders array
        ordersResponse.orders.forEach(function(order) {
          orders.push(order)
        })

        // Reset Selected Article list
        this.selectedArticles = []
      } catch (error) {
        console.log(error)
        this.success = ''
        this.error = error.orders.data.error
      }
    }
  },
  async mounted() {
    try {
      // Get Table list
      const response = (await TableService.getTablesByOwnerId(this.ownerId)).data

      // If Tables are fetched successfully
      if (response.tables) {
        const tables = this.tables
        // Add table in the tables array
        response.tables.forEach(function(table) {
          tables.push(table)
        })
      }
    } catch (error) {
      console.log(error)
      this.success = null
      this.error = error.response.data.error
    }
  },
  methods: {
    async selectArticle(articleName, articleId) {
      try {
        const selectedArticlePrompt = await swal({
          title: `How much of ${articleName} would you like to reserve?`,
          input: 'text',
          inputPlaceholder: 'Quantity',
          inputAttributes: {
            maxlength: 2
          },
          // Automatically remove whitespaces from both ends of a result string
          inputAutoTrim: true,
          confirmButtonText: 'Accept',
          showCancelButton: true
          // Timer which if passed closes the window and returns value = null
          // timer: 3000
        })
        // If input field is not empty
        if (selectedArticlePrompt.value !== '' && selectedArticlePrompt.value !== undefined) {
          let selectedArticle = {
            // Create a temporary timestamp based id for selected article using uuidv1
            selectedId: uuidv1(),
            id: articleId,
            name: articleName,
            quantity: selectedArticlePrompt.value
          }
          // Push selectedArticle to the selectedArticles array
          this.selectedArticles.push(selectedArticle)
          console.log(this.selectedArticles)
        } else {
          this.info = 'Article\'s quantity is not selected.'
          setTimeout(() => {
            this.info = null
          }, 2000)
        }
      } catch (error) {

      }
    },
    removeSelectedArticle(articleId) {
      for (var i = this.selectedArticles.length - 1; i >= 0; i--) {
        if (this.selectedArticles[i].selectedId === articleId) {
          this.selectedArticles.splice(i, 1)
          console.log(this.selectedArticles)
        }
      }
    },
    async finishReserving() {
      try {
        this.articleMenu = false
      } catch (error) {
        if (error.response.data.info) {
          this.info = error.response.data.info
          setTimeout(() => {
            this.info = null
          }, 3000)
        }
        if (error.response.data.error) {
          console.log(error)
          this.success = null
          this.error = error.response.data.error
        }
      }
    },
    async openArticleMenu(orderId) {
      try {
        // Get all Articles
        const allArticles = (await ArticleService.getAllArticles()).data
        const articleList = this.articleList = [] // Reset each time menu is opened
        // Add articles in the article array
        allArticles.articles.forEach(function(article) {
          articleList.push(article)
        })
        console.log(articleList)

        // Open Article Menu
        if (articleList.length >= 1) {
          this.articleMenu = true
        }
      } catch (error) {
        if (error.response.data.info) {
          this.info = error.response.data.info
          setTimeout(() => {
            this.info = null
          }, 3000)
        }
        if (error.response.data.error) {
          console.log(error)
          this.success = null
          this.error = error.response.data.error
        }
      }
    },
    async viewTable(tableId) {
      try {
        const response = (await TableService.viewTable(this.ownerId, tableId)).data
        if (response.table) {
          this.currentTable = response.table
        }
      } catch (error) {
        console.log(error)
        this.success = ''
        this.error = error.response.data.error
      }
    },
    async createTable() {
      try {
        const tablePrompt = await swal({
          title: 'Table number',
          input: 'text',
          inputPlaceholder: 'Table number',
          inputAttributes: {
            maxlength: 2
          },
          // Automatically remove whitespaces from both ends of a result string
          inputAutoTrim: true,
          showCancelButton: true
          // Timer which if passed closes the window and returns value = null
          // timer: 3000,
        })
        if (tablePrompt.value !== '' && tablePrompt.value !== null) {
          this.newTable.number = tablePrompt.value
          this.newTable.ownerId = this.$store.state.admin._id
          // Create Table
          const response = (await TableService.createTable(this.newTable)).data
          console.log(response)
          // If table is successfully created
          if (response.created) {
            // Success message and timeout
            this.error = null
            this.info = null
            this.success = response.success
            setTimeout(() => {
              this.success = null
            }, 3000)

            // Reset Table list after creating new table
            const ress = (await TableService.getTablesByOwnerId(this.ownerId)).data
            if (ress.tables) {
              this.tables = []
              const tables = this.tables
              ress.tables.forEach(function(table) {
                tables.push(table)
              })
            }
          }
          // Success window
          await swal(`Table ${tablePrompt.value} is created.`)
        } else {
          this.info = 'Table not specified.'
          setTimeout(() => {
            this.info = null
          }, 3000)
        }
      } catch (error) {
        if (error.response.data.info) {
          this.info = error.response.data.info
          setTimeout(() => {
            this.info = null
          }, 3000)
        }
        if (error.response.data.error) {
          console.log(error)
          this.success = ''
          this.error = error.response.data.error
        }
      }
    },
    async createOrder(currentTableId) {
      try {
        const orderName = this.newOrderName
        if (orderName !== '' && orderName !== undefined) {
          const response = (await OrderService.createOrder(this.ownerId, currentTableId, {
            newOrderName: this.newOrderName
          })).data
          console.log(response)
          // If order is saved successfully
          if (response.saved) {
            // Reset input field
            this.newOrderName = ''

            // Reset current table order list whenever new order is created
            const ordersResponse = (await OrderService.getOrdersByTableId(this.ownerId, this.currentTable._id)).data
            const orders = this.currentTableOrders = [] // Reset each time order is created
            // Add orders in the orders array
            ordersResponse.orders.forEach(function(order) {
              orders.push(order)
            })

            // After order is saved open the Reserve Article menu
            // Get all Articles
            const allArticles = (await ArticleService.getAllArticles()).data
            console.log('ALL ARTICLES: ', allArticles)
            const articleList = this.articleList = [] // Reset each time menu is opened
            // Add articles in the article array
            allArticles.articles.forEach(function(article) {
              articleList.push(article)
            })
            console.log(articleList)

            // Open Article Menu
            if (articleList.length >= 1) {
              this.articleMenu = true
            }
          }
        } else {
          this.info = 'Order must have a name.'
          setTimeout(() => {
            this.info = null
          }, 3000)
        }
      } catch (error) {
        if (error.response.data.info) {
          this.info = error.response.data.info
          setTimeout(() => {
            this.info = null
          }, 3000)
        }
        if (error.response.data.error) {
          console.log(error)
          this.success = null
          this.error = error.response.data.error
        }
      }
    },
    async deleteOrder(orderId, currentTableId) {
      try {
        // Prompt the user witk Ok and Cancel
        const deleteOrderPrompt = await swal({
          title: 'Are you sure?',
          showCancelButton: true
        })
        // If Prompt is Confirmed
        if (deleteOrderPrompt.value) {
          const response = (await OrderService.deleteOrder(this.ownerId, orderId, currentTableId)).data
          console.log(response)

          // If Order is deleted successfully
          if (response.deleted) {
            // Reset Order list
            const ordersResponse = (await OrderService.getOrdersByTableId(this.ownerId, this.currentTable._id)).data
            if (ordersResponse.orders) {
              const orders = this.currentTableOrders = [] // Reset each time order is created
              // Add orders in the orders array
              ordersResponse.orders.forEach(function(order) {
                orders.push(order)
              })
            }

            // Success message
            this.info = null
            this.error = null
            this.success = response.success
            setTimeout(() => {
              this.success = null
            }, 3000)
          }
        }
      } catch (error) {
        console.log(error)
        this.success = null
        this.info = null
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
        console.log(error)
        this.success = null
        this.error = error.response.data.error
      }
    },
    async deleteTable(tableId) {
      try {
        const response = (await TableService.deleteTable(this.ownerId, tableId)).data
        if (response.deleted) {
          this.error = null
          this.success = response.success
          setTimeout(() => {
            this.success = null
          }, 3000)

          // Reset Table list after deleting
          const ress = (await TableService.getTablesByOwnerId(this.ownerId)).data
          if (ress.tables) {
            this.tables = []
            this.tables = ress.tables
          }
        }
      } catch (error) {
        console.log(error)
        this.success = null
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .container {
    background-color: #f4f4f4;

    .reserve-article-menu {
      height: 100%;
      width: 100%;

      .selectedArticles {
        display: table;
        margin-bottom: 10px;
        min-height: 65px;

        .selectedArticleList {
          display: table;
          list-style: none;
          width: 100%;
          border: 1px solid grey;
          background-color: white;
          padding: 4px 4px 0 4px;

          .selectedArticleLi {
            display: inline-block;
            height: 36px;
            margin: 0 6px 4px 0;
            background-color: inherit;
            border: 1px solid grey;
            float: left;
            background-color: grey;

            .selectedArticleName {
              color: white;
              vertical-align: middle;
              font-weight: 600;
              font-size: 15px;
              margin: 0 5px 0 5px;
            }

            .articleQuantity {
              display: inline-block;
              height: 30px;
              width: 30px;
              padding: 2px;
              margin-top: 2px;
              color: yellow;
              font-weight: 600;
              font-size: 15px;
              border: 2px solid lighten(grey, 20);
              border-radius: 50%;
              vertical-align: middle;
              text-align: center;
            }

            .removeSelectedArticleBtn {
              float: right;
              min-height: 34px;
              min-width: 34px;
              position: relative;
              background-color: pink;
              top: 0;
              margin-left: 10px;
              border-left: 1px solid grey;
              padding: 2px 0 0 0;
              &:hover {
                background-color: lighten(red, 30);

                .closeIcon {
                  color: red;
                }
              }
              .closeIcon {
                color: lighten(red, 20);
              }
            }
          }
        }
      }

      .articleMenuHeading {
        width: 100%;
        // text-align: center;
        margin-bottom: 5px;
        font-size: 25px;
      }

      .articleMenuList {
        align-content: center;
        align-items: center;
        justify-content: center;
        background-color: #FFFFFF;
        list-style: none;
        padding: 10px 35px 10px 35px;

        .singleArticleMenuLi {
          display: inline-block;
          border: 2px solid grey;
          border-radius: 20px;
          width: 180px;
          height: 180px;
          margin-left: 20px;
          margin-bottom: 5px;
          background-color: white;
          cursor: pointer;
          &:hover {
            opacity: 0.7;
            background-color: #F8F8FF;
          }

          .articleMenuImage {
            display: block;
            margin: 5px auto 7px auto;
            border: 1px solid orange;
            border-radius: 20px;
            width: 100px;
            height: 100px;
          }

          .singleArticleMenuInfo {
            text-align: center;

            .articleCheckbox {
              height: 100%;
              width: 100%;
            }
            .info-text {
              margin: 0;
              position: relative;
              bottom: 5px;
              font-size: 15px;
              background-color: inherit;
            }
            .info-name {
              font-size: 17px;
              font-weight: 600;
            }
          }
        }
      }
      .articleMenuFinishBtn {
        background-color: green;
        position: fixed;
        left: 20%;
        bottom: 10px;
        width: 75.3%;
        &:hover {
          background-color: #00FF00;
        }
      }
    }
    .createOrder {
      max-width: 70%;
    }
    .currentTable {

      .singleOrderLi {
        list-style: none;

        .singleOrderDiv {
          background-color: yellow;
          border: 2px solid black;
          border-radius: 3px;
          max-width: 740px;
          min-height: 50px;
          text-align: center;
          margin-top: 5px;
          margin-bottom: 5px;

          .orderHeading {
            background-color: #f4f4f4;
            min-height: 50px;

            .orderName {
              font-size: 21px;
              font-weight: bold;
            }
            .deleteOrderBtn {
              float: right;
            }
            .deleteOrderBtn:hover {
              background-color: #ff4c4c;
            }
          }
        } // ./ singleOrderDiv
      } // ./ singleOrderLi
    } // ./ currentTable
  } // ./ container

  .circleDiv {
    display: inline-block;
    text-align: center;
    position: relative;
    bottom: 7px;
    margin-left: 2%;
    background-color: inherit;
    color: white;
    width: 60px;
    height: 60px;
    border: 2px solid yellow;
    border-radius: 50%;

    .tableNumber {
      display: inline-block;
      padding: 0;
      margin: auto;
      height: 40px;
      width: 40px;
      text-align: center;
      vertical-align: middle;
      // margin-top: 50%;
    }
  }

  .logout-btn {
    margin-right: 10px;
    position: fixed;
    top: 25px;
    left: 91%;
    color: white;
  }

  .listOfTables {
    position: fixed;
    background-color: pink;
    border: none;
    right: 5%;
    top: 24%;
    margin: 0;
    padding: 5px 5px 5px 5px;
    width: 288px;

    .tablesListText {
      text-align: center;
      font-size: 16px;
      margin: 5px 0 0 0;
      padding: 0;
      color: black;
      font-weight: 600;
    }
    .liSingleTable {
      text-align: center;
      padding: 0;
      margin: 2px 0 2px 2px;
      border: 1px solid grey;
      border-radius: 50%;
      height: 60px;
      width: 60px;
      display: inline-block;
      list-style: none;
      background-color: #f4f4f4;

      &:hover {
        background-color: #fff;
        opacity: 0.7;
        cursor: pointer;
      }
    }
    .liCreateTable {
      text-align: center;
      border: 1px solid grey;
      border-radius: 50%;
      height: 60px;
      width: 60px;
      display: inline-block;
      list-style: none;
      background-color: #f4f4f4;
      margin: 2px 0 2px 0px;

      &:hover {
        background-color: #fff;
        opacity: 0.7;
        cursor: pointer;
      }
      .createTableIcon {
        position: relative;
        top: 18px;
        left: 1px;
        margin: 0px;
        padding: 0px;
        width: 22px;
        height: 22px;
      }
    }
    .singleTableNumber {
      position: relative;
      text-align: center;
      top: 16px;
      padding: 0;
      margin:0;
      color: black;
      font-weight: bold;
      font-size: 19px;
    }
}

</style>
