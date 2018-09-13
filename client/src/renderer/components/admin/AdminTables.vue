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

        <!-- Should list all the tables by their owners/users -->
        <div class="list-of-tables">

          <!-- List of tables -->
          <ul id="listOfTables" class="listOfTables collection">
            <p class="tablesListText center-align">List of tables</p>
            <hr>
            <a href="#"
            class="aSingleTable">
            <!-- Create table -->
            <li @click="createTable()" id="singleTable" class="liSingleTable">
              <v-icon class="createTableIcon">add</v-icon>
              <!-- <p>Add table</p> -->
            </li>

            <!-- List all tables from the current user -->
              <li v-for="table in this.tables"
                :key="table._id"
                @click="openTable(table._id)"
                id="tableLi"
                class="liSingleTable"
              >
                <span class="singleTableNumber">Number: {{table.number}}</span>
              </li>
            </a>
          </ul>
        </div>

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import AuthenticationService from '@/services/AuthenticationService'
import swal from 'sweetalert'
import TableService from '@/services/TableService'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
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
      console.log(response)
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
    async createTable() {
      try {
        const tablePrompt = await swal({
          title: 'Table number',
          buttons: ['Cancel', 'Submit'],
          closeOnClickOutside: false,
          // Timer which if passed closes the window and returns value = null
          // timer: 3000,
          content: {
            element: 'input',
            attributes: {
              placeholder: '',
              type: 'number'
            }
          }
        })
        if (tablePrompt !== '' && tablePrompt !== null) {
          this.newTable.number = tablePrompt
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

        swal(`Table ${tablePrompt} is created.`)
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

  .logout-btn {
    margin-right: 10px;
    position: fixed;
    top: 25px;
    left: 91%;
    color: white;
  }

  .listOfTables {
    position: fixed;
    right: 5%;
    top: 24%;
    margin: 0;
    padding: 0;
    width: 250px;

  .tablesListText {
    font-size: 16px;
    margin: 5px 0 0 0;
    padding: 0;
    color: black;
    font-weight: 600;
  }
  .createTableIcon {
    margin-top: 17%;
  }
  .aSingleTable {
    text-align: center;
  }
  .liSingleTable {
    border: 1px solid grey;
    height: 60px;
    width: 90px;
    display: inline-block;
    background-color: #f4f4f4;
    margin: 2px 0 2px 3px;

    &:hover {
      background-color: #fff;
      opacity: 0.7;

    }
  }
  .singleTableNumber {
    position: relative;
    top: 10%;
    padding: 0;
    margin:0;
    color: black;
    font-weight: bold;
    font-size: 18px;
  }
}

</style>
