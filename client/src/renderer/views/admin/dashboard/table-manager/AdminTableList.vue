<template>
	<div class="admin-tables">
		<v-layout column class="right-side">
			<v-flex>
				<div class="admin-header">
					<h1 class="heading">Tables</h1>
					<LogoutBtn />
				</div>
			</v-flex>

			<v-flex class="admin-container">
				<!-- Display messages -->
				<div class="error-msg" v-if="error" v-html="error" />
				<div class="success-msg" v-if="success" v-html="success" />
				<div class="info-msg" v-if="info" v-html="info" />

				<div class="container">
					<div class="admin-table-list">
						<h3 class="tablesListText">List of Tables</h3>
						<!-- List of Tables -->
						<ul v-if="!articleMenu" id="listOfTables" class="listOfTables collection">
							<li
								v-for="table in this.tables"
								:key="table._id"
								@click="getTable(table._id)"
								class="liSingleTable"
							>
								<div class="singleTableNumber">{{table.number}}</div>
							</li>
							<!-- Create table -->
							<li @click="createTable" class="liCreateTable" title="Add table">
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
// Components
// import AdminSideMenu from '@/components/admin/AdminSideMenu'
// Services
import TableService from '@/services/TableService'
import OrderService from '@/services/OrderService'
// Modules
import swal from 'sweetalert2'

export default {
	components: {
		// AdminSideMenu
	},
	data() {
		return {
			articleMenu: false,
			currentTable: null,
			reservedArticles: [],
			currentOrderId: null,
			currentOrderName: null,
			selectedArticles: [],
			articleList: [],
			currentTableOrders: [],
			tableList: [],
			tables: [],
			newTable: {
				number: '',
				// TODO: Add owner name and username
				user_id: ''
			},
			user_id: this.$store.state.admin._id,
			// Messages
			error: null,
			success: null,
			info: null
		}
	},
	async mounted() {
		try {
			// Get Table list
			const response = (await TableService.getTablesByuser_id(this.user_id)).data

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
				const ordersResponse = (await OrderService.getOrdersByTableId(this.user_id, this.currentTable._id)).data
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
		async getTable(tableId) {
			try {
				const response = (await TableService.getTable(this.user_id, tableId)).data
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
					this.newTable.user_id = this.$store.state.admin._id
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
						const ress = (await TableService.getTablesByuser_id(this.user_id)).data
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
		}
	}
}
</script>

<style scoped lang="scss">
	.admin-table-list {
		text-align: center;

		.tablesListText {
			font-family: sans-serif;
			text-align: center;
			font-size: 25px;
			letter-spacing: 1.5px;
			margin: 5px 0 10px 0;
			padding: 0;
			color: black;
			// background-color: grey;
		}

		.listOfTables {
			width: 100%;
			background-color: lighten(black, 85);
			border: 2px solid grey;
			border-radius: 10px;
			right: 5%;
			top: 24%;
			margin: 0;
			padding: 10px 3px 10px 0;

			.liSingleTable {
				vertical-align: middle;
				text-align: center;
				padding: 0;
				margin: 2px 0 2px 4px;
				border: 1px solid grey;
				border-radius: 50%;
				height: 72px;
				width: 72px;
				display: inline-block;
				list-style: none;
				background-color: #f4f4f4;

				&:hover {
					border: 3px solid lighten(orange, 20);
					cursor: pointer;
					.singleTableNumber {
						position: relative;
						top: 10px;
						padding: 0;
						margin: 0;
						color: black;
						font-size: 30px;
					}
				}
			}
			.liCreateTable {
				vertical-align: middle;
				text-align: center;
				background-color: lighten(green, 65);
				border: 2px solid green;
				border-radius: 50%;
				height: 72px;
				width: 72px;
				display: inline-block;
				list-style: none;
				&:hover {
					cursor: pointer;
					background-color: #fff;
					.createTableIcon {
						color: black;
					}
				}
				.createTableIcon {
					font-size: 38px;
					position: relative;
					top: 16px;
					left: 1px;
					margin: 0;
					padding: 0;
					color: green;
				}
			}
			.singleTableNumber {
				position: relative;
				top: 15px;
				padding: 0;
				margin: 0;
				color: black;
				font-size: 25px;
			}
		}
}

</style>
