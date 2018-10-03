<template>
  <div class="admin-tables">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
          <h1 class="heading">Tables</h1>
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
          <div class="admin-table-list">
            <!-- TODO: Apply some styles to the list -->
            <!-- List of Tables -->
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
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import TableService from '@/services/TableService'
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import AuthenticationService from '@/services/AuthenticationService'
import OrderService from '@/services/OrderService'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      articleMenu: false,
      tables: [],
      newTable: {
        number: '',
        // TODO: Add owner name and username
        ownerId: ''
      },
      ownerId: this.$store.state.admin._id,
      error: null,
      success: null,
      info: null
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
  methods: {
    async viewTable(tableId) {
      try {
        const response = (await TableService.viewTable(this.ownerId, tableId)).data
        if (response.table) {
          // this.currentTable = response.table
          this.$router.push({
            name: 'admin-current-table',
            params: {tableId}
          })
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
    }
  }
}
</script>

<style scoped lang="scss">

  .listOfTables {
    position: fixed;
    background-color: pink;
    border: none;
    right: 5%;
    top: 24%;
    margin: 0;
    padding: 5px 5px 5px 5px;
    width: 74%;

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
      height: 72px;
      width: 72px;
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
      height: 72px;
      width: 72px;
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
        top: 23px;
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
      vertical-align: middle;
      top: 20px;
      padding: 0;
      margin: auto;
      color: black;
      font-weight: bold;
      font-size: 19px;
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
