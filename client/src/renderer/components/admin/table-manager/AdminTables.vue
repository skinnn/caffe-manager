<template>
  <div class="admin-tables">
    <div>
      <admin-side-menu />
    </div>
    <v-layout column class="right-side">
      <v-flex>
        <div class="admin-header">
          <h1 v-if="!currentTable" class="heading">Tables</h1>
          <h1 v-if="currentTable" class="heading">
            Table
            <div class="circleDiv">
              <div class="tableNumber">{{currentTable.number}}</div>
            </div>
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

        <!-- Should list all the tables by their owners/users -->
        <div class="list-of-tables">
          <div v-if="currentTable" class="viewTable">
            <p>Number: {{currentTable.number}}</p>
          </div>
          <!-- List of tables -->
          <ul id="listOfTables" class="listOfTables collection">
            <p class="tablesListText center-align">List of tables</p>
            <hr>

            <!-- List all tables from the current user -->
            <li
              v-for="table in this.tables"
              :key="table._id"
              @click="viewTable(table._id)"
              class="liSingleTable"
            >
              <span class="singleTableNumber">{{table.number}}</span>
            </li>

            <!-- Create table -->
            <li @click="createTable()" class="liCreateTable">
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
import swal from 'sweetalert2'
import TableService from '@/services/TableService'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      currentTable: null,
      ownerId: this.$store.state.admin._id,
      tables: [],
      newTable: {
        number: '',
        // TODO: Add owner name and username
        ownerId: ''
      },
      error: null,
      success: null
    }
  },
  async mounted() {
    try {
      const response = (await TableService.getTablesByOwnerId(this.ownerId)).data
      // Get Table list
      if (response.tables) {
        const tables = this.tables
        // Add table in the tables array
        response.tables.forEach(function(table) {
          tables.push(table)
        })
      }
    } catch (error) {
      console.log(error)
      this.success = ''
      this.error = error.response.data.error
    }
  },
  methods: {
    async viewTable(tableId) {
      // console.log(tableId)
      try {
        const response = (await TableService.viewTable(this.ownerId, tableId)).data
        console.log(response)
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
        if (tablePrompt !== '' && tablePrompt !== null) {
          this.newTable.number = tablePrompt.value
          this.newTable.ownerId = this.$store.state.admin._id
          // Create Table
          const response = (await TableService.createTable(this.newTable)).data
          console.log(response)
          // If table is successfully created
          if (response.created) {
            // Success message and timeout
            this.error = null
            this.success = response.success
            setTimeout(() => {
              this.success = null
            }, 3000)

            // Reset Table list after creating
            const ress = (await TableService.getTablesByOwnerId(this.ownerId)).data
            if (ress.tables) {
              this.tables = []
              const tables = this.tables
              ress.tables.forEach(function(table) {
                tables.push(table)
              })
            }
          }
        }

        // Success window
        await swal(`Table ${tablePrompt.value} is created.`)
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
        console.log(error)
        this.success = null
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<style scoped lang="scss">

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
      margin-top: 14%;
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
