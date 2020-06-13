<template>
	<!-- Side List of Tables -->
	<div class="admin-table-list">
		<!-- List of tables from the current logged in user -->
		<ul v-if="!articleSubgroupList && currentSubgroup.isOpened === false"
			id="listOfTables"
			class="listOfTables collection"
		>
			<p class="tablesListText">List of Tables</p>
			<hr class="tableListDivider">

			<!-- Single Table Li -->
			<li
				v-for="table in this.tableList"
				:key="table.id"
				@click="getTable(table.id)"
				class="liSingleTable"
				v-bind:class="{ 'activeTable' : currentTable.id === table.id }"
			>
				<span class="singleTableNumber">{{table.number}}</span>
			</li>
			<!-- Create table -->
			<li @click="createTable" class="liCreateTable" title="Add table">
				<v-icon class="createTableIcon">add</v-icon>
			</li>
		</ul>
	</div>
</template>

<script>
import TableService from '@/services/TableService'
import swal from 'sweetalert2'

export default {
	props: [
		'articleSubgroupList',
		'currentSubgroup',
		'currentTable',
		'error',
		'success',
		'info'
	],
	data() {
		return {
			user_id: this.$store.state.admin.id,
			tableList: []
		}
	},
	async mounted() {
		try {
			// Get Table list
			var allTables = (await TableService.getTablesByuser_id(this.user_id)).data
			// If Tables are fetched successfully
			if (allTables.tables) {
				const tableList = this.tableList
				// Add table in the tables array
				allTables.tables.forEach(function(table) {
					tableList.push(table)
				})
			}
		} catch (error) {
			console.log(error)
			if (allTables.error) {
				this.success = null
				this.error = error.allTables.data.error
			}
		}
	},
	methods: {
		async getTable(tableId) {
			try {
				// console.log('tableid: ', tableId)
				// console.log('owner id: ', this.user_id)
				const response = (await TableService.getTable(this.user_id, tableId)).data
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
					this.newTable.user_id = this.user_id
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
						const ress = (await TableService.getTablesByuser_id(this.user_id)).data
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
		}
	}
}
</script>

<style scoped lang="scss">

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

</style>
