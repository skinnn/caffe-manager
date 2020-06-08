<template>
	<div class="user-list">
		<v-layout column class="right-side">
			<!-- <v-flex>
				<div class="admin-header">
						<h1 class="heading">Staff Members</h1>
						<LogoutBtn />
				</div>
			</v-flex> -->

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
// import AdminSideMenu from '@/components/admin/AdminSideMenu'
// Services
import AdminService from '@/services/AdminService'
import UserService from '@/services/UserService'
// Helpers
import { mapGetters } from 'vuex'

export default {
	components: {
		// AdminSideMenu
	},

	computed: {
		...mapGetters([])
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

	mounted() {
		this.getUsers()
	},

	methods: {
		async getUsers() {
			try {
				const res = (await UserService.getAllUsers()).data

				// Get User list
				if (res.users) {
					this.users = res.users

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

		pageChanged() {
			let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
			let end = start + this.pagination.itemsPerPage
			// Change Displayed Articles
			this.displayedUsers = this.users.slice(start, end)
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
			const confirmation = confirm('Are you sure?')

			if (confirmation) {
				try {
					const userId = user._id
					// TODO: Change files deleting, create file db model and upload files in separate request
					const imgPath = user.files[0]
					console.log(imgPath)
					const res = await UserService.deleteUserById(userId, imgPath)
					// If User is deleted successfully
					if (res.status === 200) {
						// Set success message and timeout
						this.error = null
						this.success = res.data.message
						setTimeout(() => {
							this.success = null
						}, 3000)

						// Reset User list after deleting
						const filteredUsers = this.users.filter(user => user._id !== userId)
						this.users = filteredUsers
						// this.displayedAdmins = filteredUsers
						this.pageChanged()
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
