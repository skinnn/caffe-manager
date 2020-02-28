<template>
	<div class="user-list">
		<div>
			<admin-side-menu />
		</div>
		<v-layout column class="right-side">
			<v-flex>
				<div class="admin-header">
						<h1 class="heading">Staff Members</h1>
						<admin-logout-btn />
				</div>
			</v-flex>

			<v-flex class="admin-container">
				<!-- Display messages -->
				<div class="error-msg" v-if="error" v-html="error" />
				<div class="success-msg" v-if="success" v-html="success" />
				<div class="info-msg" v-if="info" v-html="info" />

				<!-- TODO: Add animation for fetching/displaying Users possibly with Scroll Reveal -->
				<!-- List of all Users/Staff in the db -->
				<div class="list-of-users">
					<v-select
						v-model="pagination.itemsPerPage"
						:items="pagination.selectItemsPerPage"
						@change="changePagination"
						label="Items per page"
						class="pagination-items-per-page"
						required
					></v-select>

					<!-- Pagination top -->
					<v-pagination
						v-if="pagination.totalPages !== null && pagination.totalPages !== 0"
						v-model="pagination.currentPage"
						:length="pagination.totalPages"
						@input="pageChanged"
					></v-pagination>

					<!-- TODO: Implement Search -->

					<v-data-table
						:headers="headers"
						:items="users"
						hide-actions
						class="elevation-1"
						dark
					>
						<template slot="items" slot-scope="props">
							<td class="td text-xs-left" @click="viewUser(props.item.id)">
								<img class="admin-image" v-if="props.item.image" :src="`http://localhost:9090/${props.item.image}`" />
							</td>
							<td class="td text-xs-left" @click="viewUser(props.item.id)">
								<span class="admin-name">
									{{ props.item.name }}
								</span>
							</td>
							<td class="td text-xs-left" @click="viewUser(props.item.id)">
								<span class="admin-username">
									{{ props.item.username }}
								</span>
							</td>
							<td class="td text-xs-center">
								<v-btn @click="editUserPage(props.item._id)" class="edit-btn yellow">Edit</v-btn>
								<v-btn @click="deleteUser(props.item)" class="delete-btn white">Delete</v-btn>
							</td>
						</template>
					</v-data-table>

					<!-- Pagination bottom -->
					<v-pagination
					v-if="pagination.totalPages !== null && pagination.totalPages !== 0"
					v-model="pagination.currentPage"
					:length="pagination.totalPages"
					@input="pageChanged"
				></v-pagination>

				</div>

			</v-flex>
		</v-layout>
	</div>
</template>

<script>
// Components
import AdminSideMenu from '@/components/admin/AdminSideMenu'
// Services
import AdminService from '@/services/AdminService'
// Helpers
import { mapGetters } from 'vuex'

export default {
	components: {
		AdminSideMenu
	},

	computed: {
		...mapGetters(['getUserToken'])
	},

	data() {
		return {
			users: [],
			displayedUsers: [],
			adminId: this.$store.state.user._id,
			headers: [
				{
					text: 'Image',
					align: 'left',
					sortable: false,
					value: 'image'
				},
				{
					text: 'Name', align: 'left', sortable: true, value: 'name'},
				{ text: 'Username', sortable: true, value: 'username' },
				{ text: 'Options', sortable: false, align: 'center', value: 'option' }
			],
			pagination: {
				currentPage: 1,
				totalPages: null,
				itemsPerPage: 5,
				selectItemsPerPage: [
					1,
					5,
					20,
					50,
					80
				]
			},
			error: null,
			success: null,
			info: null
		}
	},
	async mounted() {
		try {
			const token = this.getUserToken
			const response = (await AdminService.getAllUsers(token)).data

			// Get User list
			if (response.users) {
				const users = this.users
				// Add user in the users array
				response.users.forEach(function(user) {
					users.push(user)
				})

				// Handle pagination
				let l = this.users.length
				let s = this.pagination.itemsPerPage
				this.pagination.totalPages = Math.floor(l / s)
				let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
				let end = start + this.pagination.itemsPerPage
				// Set Displayed Articles
				this.displayedUsers = this.users.slice(start, end)
			}
		} catch (error) {
			this.success = null
			this.error = error.response.data.error
			console.log(error)
		}
	},
	methods: {
		changePagination() {
			let l = this.users.length
			let s = this.pagination.itemsPerPage
			this.pagination.totalPages = Math.floor(l / s)
			let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
			let end = start + this.pagination.itemsPerPage
			// Set Displayed Articles
			this.displayedUsers = this.users.slice(start, end)
			console.log(this.pagination.itemsPerPage)
		},

		async pageChanged() {
			try {
				let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
				let end = start + this.pagination.itemsPerPage
				// Change Displayed Articles
				this.displayedAdmins = this.admins.slice(start, end)
			} catch (error) {
				console.log(error)
			}
		},

		viewUser(userId) {
			this.$router.push({name: 'admin-view-user', params: { userId }})
		},

		editUserPage(userId) {
			this.$router.push({
				name: 'admin-edit-user',
				params: {userId}
			})
		},

		async deleteUser(user) {
			let confirmation = confirm(
				'Are you sure?'
			)
			if (confirmation) {
				try {
					const adminId = this.adminId
					const userId = user._id
					const imgPath = user.image
					const response = (await AdminService.deleteUser(adminId, userId, imgPath)).data
					// If User is deleted successfully
					if (response.deleted) {
						// Set success message and timeout
						this.error = null
						this.success = response.success
						setTimeout(() => {
							this.success = null
						}, 3000)

						// Reset User list after deleting
						const ress = (await AdminService.getAllUsers()).data
						if (ress.users) {
							this.users = []
							const users = this.users
							ress.users.forEach(function(user) {
								users.push(user)
							})
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

	.list-title {
		font-size: 17px;
	}

	.list-of-users {
		width: 100%;

		.td {
			height: 92px;
			cursor: pointer;
		}
		.admin-image {
			max-width: 80px;
			max-height: 80px;
			margin-top: 5px;
			margin-left: 5px;
			border-radius: 5px;
		}
		.admin-name {
			font-size: 18px;
		}
		.admin-username {
			font-weight: 600;
			font-size: 17px;
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
