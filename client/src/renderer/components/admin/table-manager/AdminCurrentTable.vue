<!-- TODO: Separate Table list and current table pages -->
<template>
  <div class="admin-tables">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
          <!-- Current Table Heading -->
          <h1 v-if="currentTable" class="heading">
            <v-btn @click="goBack" class="goBackBtn blue" fab>
              <v-icon>view_carousel</v-icon>
            </v-btn>
            <v-btn @click="deleteTable(currentTable._id)" class="delete-btn pink">
              Delete
            </v-btn>
            Table
            <div class="circleDiv">
              <div class="tableNumber">{{currentTable.number}}</div>
            </div>
          </h1>
          <!-- ./ Current Table Heading -->
          <admin-logout-btn />
        </div>
      </v-flex>

      <v-flex class="admin-container">
        <!-- Display messages -->
        <div class="error-msg" v-if="error" v-html="error" />
        <div class="success-msg" v-if="success" v-html="success" />
        <div class="info-msg" v-if="info" v-html="info" />

        <div class="container">

          <!-- Reserve Article Menu -->
          <div v-if="reservingMenu" class="reserve-article-menu">
            <!-- Selected Articles -->
            <div v-if="selectedArticles != 0" class="selectedArticles">
              <!-- TODO: Implement Search -->
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
            <ul class="reservingMenuList">
              <h2 class="reservingMenuHeading">
                Choose subgroup for order:
                <span class="currentOrderName">{{currentOrderName}}</span>
              </h2>
              <!-- TODO: Display Article Subgroups > Articles - instead of listing all articles -->
              <li
                v-for="subgroup in this.articleSubgroups"
                :key="subgroup._id"
                @click="selectArticle(subgroup.name, subgroup._id, subgroup.price)"
                class="singleArticleMenuLi"
              >
                <img
                  v-if="subgroup.image"
                  :src="`http://localhost:8080/${subgroup.image}`"
                  class="reservingMenuImage"
                  alt="No image"
                >
                <!-- Placeholder if there is no subgroup image -->
                <div v-if="!subgroup.image" class="reservingMenuImage"></div>
                <div class="singleArticleMenuInfo">
                  <p class="info-text info-name">{{subgroup.name}}</p>
                  <p class="info-text">Quantity: {{subgroup.quantity}}</p>
                  <p class="info-text">Price: {{subgroup.price}} {{settings.currency}}</p>
                </div>
              </li>
              <v-btn
                class="reservingMenuReserveBtn"
                @click="reserveArticles"
              >
                Reserve
              </v-btn>
              <v-btn
                class="reservingMenuCancelBtn"
                @click="cancelReserving"
              >
                Cancel
              </v-btn>
            </ul>
          </div>

          <!-- Current Table Content -->
          <div v-if="currentTable && !reservingMenu" class="currentTable">
            <div class="createOrderDiv">
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

            <!-- List of Orders -->
            <div class="orders">
              <ul class="order-list">
                <li
                  v-for="order in this.currentTableOrders"
                  :key="order._id"
                  class="singleOrderLi"
                >
                  <div class="singleOrderDiv">
                    <div class="orderHeading">
                      <span class="orderName">{{order.name}}</span>
                      <hr >
                      <v-btn @click="deleteOrder(order._id, currentTable._id)" class="deleteOrderBtn" small fab>
                        <v-icon>delete</v-icon>
                      </v-btn>
                      <v-btn
                        class="addArticleBtn"
                        @click="openArticleMenu(order._id, order.name)"
                      >
                        Add article
                      </v-btn>
                    </div>
                    <div class="orderContent">
                      <!-- Reserved Articles by Table id -->
                      <ul class="reservedArticleUl">
                        <div class="resArtHeaders" style="text-align: left; width: 100%;">
                          <p style="position:relative; left: 0px; display: inline; margin:0 0 0 25px; font-size: 20px;">Article:</p>
                          <p style="position:relative; left: 0px; display: inline; margin:0 0 0 215px; font-size: 20px;">Quantity:</p>
                          <p style="position:relative; left: 0px; display: inline; margin:0 0 0 220px; font-size: 20px;">Price:</p>
                        </div>
                        <li
                          v-for="reservedArticle in reservedArticles"
                          v-if="order._id === reservedArticle.inWhichOrder"
                          class="reservedArticleLi"
                        >
                          <span class="reservedArticleName">
                            {{reservedArticle.name}}
                          </span>
                          <v-badge class="reservedArticleQuantity">
                            <span slot="badge">{{reservedArticle.quantity}}</span>
                          </v-badge>
                          <span class="reservedArticlePrice">
                            {{reservedArticle.total_price}}
                            <span>{{settings.currency}}</span>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div> <!-- ./ Current Table Content -->

          <div class="admin-table-list">
            <!-- List of Tables from the current logged in user -->
            <ul v-if="!reservingMenu" id="listOfTables" class="listOfTables collection">
              <p class="tablesListText">List of Tables</p>
              <hr class="tableListDivider">

              <!-- Single Table Li -->
              <li
                v-for="table in this.tableList"
                :key="table._id"
                @click="viewTable(table._id)"
                class="liSingleTable"
                v-bind:class="{ 'activeTable' : currentTable._id === table._id }"
              >
                <span class="singleTableNumber">{{table.number}}</span>
              </li>
              <!-- Create table -->
              <li @click="createTable" class="liCreateTable" title="Add table">
                <v-icon class="createTableIcon">add</v-icon>
              </li>
            </ul>
          </div>

        </div> <!-- ./ Container -->
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// TODO: Delete Reserved Articles when Order is deleted
// TODO: Delete Reserved Articles when Orders are finished (bill is printed)
// Components
import AdminSideMenu from '@/components/admin/AdminSideMenu'
// Services
import OrderService from '@/services/OrderService'
import ArticleService from '@/services/ArticleService'
import TableService from '@/services/TableService'
import ArticleSubgroupService from '@/services/ArticleSubgroupService'
// Modules
import uuidv1 from 'uuid/v1'
import swal from 'sweetalert2'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      reservingMenu: false,
      articleSubgroups: [],
      reservedArticles: [],
      currentOrderId: null,
      currentOrderName: null,
      selectedArticles: [],
      // TODO: Get currency from the Admin Settings - state
      settings: {
        currency: this.$store.state.settings.currency
      },
      articleList: [],
      currentTable: null,
      currentTableOrders: [],
      tableList: [],
      ownerId: this.$store.state.admin._id,
      newOrderName: '',
      newTable: {
        number: '',
        // TODO: Add owner name and username
        ownerId: ''
      },
      // Messages
      error: null,
      success: null,
      info: null
    }
  },
  async mounted() {
    try {
      // Get Current Table
      const currentTableId = this.$store.state.route.params.tableId
      var currentTable = (await TableService.viewTable(this.ownerId, currentTableId)).data
      // If Current Table is fetched successfully
      if (currentTable.table) {
        this.currentTable = currentTable.table
      }

      // Get Table list
      var allTables = (await TableService.getTablesByOwnerId(this.ownerId)).data
      // If Tables are fetched successfully
      if (allTables.tables) {
        const tableList = this.tableList
        // Add table in the tables array
        allTables.tables.forEach(function(table) {
          tableList.push(table)
        })
      }

      // Get Reserved Articles by Current Table id
      let sendData = {
        currentTableId: this.currentTable._id,
        ownerId: this.ownerId
      }
      var resArticles = (await OrderService.getReservedArticles(sendData)).data
      // If Reserved Articles are fetched successfully
      if (resArticles.reservedArticles) {
        let reservedArticleList = this.reservedArticles = []
        // reservedArticleList = []
        resArticles.reservedArticles.forEach(function(reservedArticle) {
          reservedArticleList.push(reservedArticle)
        })
      }
    } catch (error) {
      console.log(error)
      if (currentTable.error) {
        this.success = null
        this.error = error.currentTable.data.error
      }
      if (allTables.error) {
        this.success = null
        this.error = error.allTables.data.error
      }
    }
  },
  watch: {
    // Whenever current table changes, fetch the data
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

      // Reset Reserved Articles by Current Table id
      let sendData = {
        currentTableId: this.currentTable._id,
        ownerId: this.ownerId
      }
      var resArticles = (await OrderService.getReservedArticles(sendData)).data
      // If Reserved Articles are fetched successfully
      if (resArticles.reservedArticles) {
        let reservedArticleList = this.reservedArticles = []
        resArticles.reservedArticles.forEach(function(reservedArticle) {
          reservedArticleList.push(reservedArticle)
        })
      }
    }
  },
  methods: {
    goBack() {
      // console.log(this.$store.state.route.from)
      this.$router.push({
        name: 'admin-table-list'
      })
    },
    cancelReserving() {
      // Reset Selected Article list
      this.selectedArticles = []
      console.log(this.selectedArticles)
      // Reset currentOrderId to null
      this.currentOrderId = null
      console.log(this.currentOrderId)
      // Close Select Article menu
      this.reservingMenu = false
      console.log(this.reservingMenu)
      // Reset Order name
      this.currentOrderName = null
      console.log(this.currentOrderName)
    },
    async selectArticle(articleName, articleId, articlePrice) {
      try {
        const selectedArticlePrompt = await swal({
          title: `Quantity for article: ${articleName}`,
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
            // Create a temporary timestamp based ID for selected article
            selectedId: uuidv1(),
            id: articleId,
            name: articleName,
            quantity: selectedArticlePrompt.value,
            price: articlePrice
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
        return false
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
    removeSelectedArticle(articleId) {
      for (var i = this.selectedArticles.length - 1; i >= 0; i--) {
        if (this.selectedArticles[i].selectedId === articleId) {
          this.selectedArticles.splice(i, 1)
          // console.log(this.selectedArticles)
        }
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
              let tables = this.tableList = []
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
    async reserveArticles() {
      try {
        // If there are articles in the selectedArticles array
        if (this.selectedArticles.length > 0) {
          const orderData = {
            selectedArticles: this.selectedArticles,
            ownerId: this.ownerId,
            currentTableId: this.currentTable._id,
            orderId: this.currentOrderId
          }
          // Reserve Selected Articles
          const response = (await OrderService.reserveArticles(orderData)).data
          console.log(response)

          // If articles are successfully reserved
          if (response.saved) {
            // Success message and timeout
            this.error = null
            this.info = null
            this.success = response.success
            setTimeout(() => {
              this.success = null
            }, 2000)
          }

          // Reset Selected Article list
          this.selectedArticles = []
          // Reset currentOrderId to null
          this.currentOrderId = null
          // Close Select Article menu
          this.reservingMenu = false

        // If no articles has been selected
        } else {
          this.error = null
          this.success = null
          this.info = 'No articles have been selected.'
          setTimeout(() => {
            this.info = null
          }, 2000)
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
      // Reset Reserved Articles by Current Table id
      let sendData = {
        currentTableId: this.currentTable._id,
        ownerId: this.ownerId
      }
      var resArticles = (await OrderService.getReservedArticles(sendData)).data
      // If Reserved Articles are fetched successfully
      if (resArticles.reservedArticles) {
        let reservedArticleList = this.reservedArticles = []
        resArticles.reservedArticles.forEach(function(reservedArticle) {
          reservedArticleList.push(reservedArticle)
        })
      }
    },
    async openArticleMenu(orderId, currentOrderName) {
      try {
        // // Get all Articles
        // const allArticles = (await ArticleService.getAllArticles()).data
        // // Reset Article List each time menu is opened
        // const articleList = this.articleList = []
        // // Add articles in the article array
        // allArticles.articles.forEach(function(article) {
        //   articleList.push(article)
        // })

        const subgroupsRes = (await ArticleSubgroupService.getSubgroupsFromMainStorages()).data
        console.log(subgroupsRes)
        const articleSubgroups = this.articleSubgroups = []
        // Add articles in the article array
        subgroupsRes.subgroups.forEach(function(subgroup) {
          articleSubgroups.push(subgroup)
        })

        // // Set Current Order Id and Name
        // this.currentOrderId = orderId
        // this.currentOrderName = currentOrderName
        // console.log('Current Order Name: ', this.currentOrderName)
        //
        // // Open Article Menu if there are any articles
        // if (articleSubgroups.length >= 1) {
        //   this.reservingMenu = true
        // }
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
    // TODO: Create Order with prompt for name, same like reserving article quantity
    async createOrder(currentTableId) {
      try {
        const orderName = this.newOrderName
        if (orderName !== '' && orderName !== undefined) {
          const response = (await OrderService.createOrder(this.ownerId, currentTableId, {
            newOrderName: orderName
          })).data
          console.log(response)

          // If order is saved successfully
          if (response.saved) {
            // Reset current table order list whenever new order is created
            const ordersResponse = (await OrderService.getOrdersByTableId(this.ownerId, this.currentTable._id)).data
            const orders = this.currentTableOrders = [] // Reset each time order is created
            // Add orders in the orders array
            await ordersResponse.orders.forEach(function(order) {
              orders.push(order)
            })

            // After order is saved open the Reserve Article menu
            // Get all Articles
            const allArticles = (await ArticleService.getAllArticles()).data
            const articleList = this.articleList = [] // Reset each time menu is opened
            // Add articles in the article array
            await allArticles.articles.forEach(function(article) {
              articleList.push(article)
            })

            // If there is one or more articles in the list
            if (articleList.length >= 1) {
              // Open Article Menu
              this.reservingMenu = true
              // Set Current Order Id
              this.currentOrderId = response.orderId
              // Set Order Name
              this.currentOrderName = response.name
            // If there is no articles in the list just print the message
            } else {
              this.error = null
              this.success = null
              this.info = 'There are no articles.'
              setTimeout(() => {
                this.info = null
              }, 3000)
            }
          }
        } else {
          this.error = null
          this.success = null
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
              await ordersResponse.orders.forEach(function(order) {
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
            let tables = this.tableList = []
            ress.tables.forEach(function(table) {
              tables.push(table)
            })

            // Redirect to the Table List page
            this.$router.push({
              name: 'admin-table-list'
            })
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

    .listOfTables {
      position: fixed;
      background-color: lighten(black, 85);
      border: 2px solid grey;
      border-radius: 10px;
      right: 5%;
      top: 24%;
      margin: 0;
      padding: 5px 5px 5px 5px;
      width: 288px;

      .tablesListText {
        text-align: center;
        font-size: 18px;
        margin: 0 0 4px 0;
        padding: 0;
        color: black;
        font-weight: 600;
      }

      .tableListDivider {
        margin: 0 0 4px 0;
      }

      .liSingleTable {
        list-style: none;
        vertical-align: middle;
        text-align: center;
        padding: 0;
        margin: 2px 0 2px 2px;
        border: 1px solid grey;
        border-radius: 50%;
        height: 60px;
        width: 60px;
        display: inline-block;
        background-color: #f4f4f4;

        &:hover {
          border: 3px solid lighten(orange, 20);
          cursor: pointer;
          .singleTableNumber {
            position: relative;
            top: 13px;
            padding: 0;
            margin: 0;
            color: black;
          }
        }
      }

      .activeTable {
        background-color: lighten(orange, 10);
      }

      .liCreateTable {
        vertical-align: middle;
        text-align: center;
        background-color: lighten(green, 65);
        border: 2px solid green;
        border-radius: 50%;
        height: 60px;
        width: 60px;
        display: inline-block;
        list-style: none;
        margin: 2px 0 2px 0px;
        &:hover {
          background-color: #fff;
          cursor: pointer;
          .createTableIcon {
            color: black;
          }
        }

        .createTableIcon {
          position: relative;
          top: 15px;
          left: 1px;
          font-size: 28px;
          margin: 0px;
          padding: 0px;
          color: green;
        }
      }
      .singleTableNumber {
        position: relative;
        text-align: center;
        top: 15px;
        left: 1px;
        padding: 0;
        margin:0;
        color: black;
        font-weight: bold;
        font-size: 19px;
      }
    }

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

      .reservingMenuHeading {
        width: 100%;
        margin-bottom: 5px;
        font-size: 25px;

        .currentOrderName {
          color: orange;
        }
      }

      .reservingMenuList {
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

          .reservingMenuImage {
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

      .reservingMenuReserveBtn {
        background-color: lighten(green, 50);
        // font-weight: 600;
        font-size: 16px;
        letter-spacing: 1px;
        position: fixed;
        left: 20%;
        bottom: 0;
        width: 49.5%;
        &:hover {
          background-color: #00FF00;
        }
      }

      .reservingMenuCancelBtn {
        background-color: pink;
        // font-weight: 600;
        font-size: 16px;
        letter-spacing: 1px;
        position: fixed;
        left: 70%;
        bottom: 0;
        width: 25.4%;
        &:hover {
          background-color: red;
        }
      }
    }

    .createOrderDiv {
      max-width: 70%;
    }
    .currentTable {

      .singleOrderLi {
        list-style: none;
        margin-bottom: 50px;

        .singleOrderDiv {
          background-color: inherit;
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
              font-size: 23px;
              font-weight: bold;
            }
            .deleteOrderBtn {
              float: right;
            }
            .deleteOrderBtn:hover {
              background-color: #ff4c4c;
            }
          }

          .orderContent {

            .reservedArticleUl {
              list-style: none;
              padding: 0;
              margin: 0;

              .reservedArticleLi {
                padding: 5px 0 5px 0;
                background-color: lighten(yellow, 30);
                font-size: 16px;
                border-top: 1px solid black;
                min-height: 45px;

                .reservedArticleName {
                  position: relative;
                  top: 5px;
                  float: left;
                  text-align: left;
                  max-width: 300px;
                  margin-left: 25px;
                }

                .reservedArticleQuantity {
                  position: relative;
                  top: 17px;
                  float:right;
                  margin-left: 20px;
                  right: 55%;
                }

                .reservedArticlePrice {
                  position: relative;
                  top: 5px;
                  float:right;
                  margin-right: 40px;
                  text-align: left;
                  max-width: 100px;
                }
              }
              // All elements except of last one
              .reservedArticleLi:not(:last-child) {
                margin: 0 0 0 0;
                border-bottom: 1px solid black;
              }
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

</style>
