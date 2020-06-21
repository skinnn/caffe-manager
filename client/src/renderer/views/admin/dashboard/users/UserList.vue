<template>
	<div class="user-list">
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
				:items="displayedUsers"
				hide-actions
				class="elevation-1"
				dark
			>
				<template slot="items" slot-scope="props">
					<td class="td text-xs-left">
						<img @click="viewUser(props.item.id)" class="user-image" :src="props.item.profileImage ? props.item.profileImage : null" />
					</td>
					<td class="td text-xs-left">
						<span @click="viewUser(props.item.id)" class="user-name">
							{{ props.item.name }}
						</span>
					</td>
					<td class="td text-xs-left">
						<span @click="viewUser(props.item.id)" class="user-username">
							{{ props.item.username }}
						</span>
					</td>
					<td class="td text-xs-left">
						<span class="user-permissions">
							{{ props.item.roles[0] }}
						</span>
					</td>
					<td class="td text-xs-center options">
						<button @click="deleteUser(props.item)" class="btn-delete">Delete</button>
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
	</div>
</template>

<script>
// Services
import AdminService from '@/services/AdminService'
import UserService from '@/services/UserService'
// Helpers
import { mapGetters } from 'vuex'

export default {
	components: {},

	computed: {
		...mapGetters(['getUser'])
	},

	data() {
		return {
			users: [],
			displayedUsers: [],
			adminId: this.$store.state.user.id,
			headers: [
				{ text: 'Image', align: 'left', sortable: false, value: 'image' },
				{ text: 'Name', align: 'left', sortable: true, value: 'name' },
				{ text: 'Username', sortable: true, value: 'username' },
				{ text: 'Permissions', sortable: true, value: 'roles' },
				{ text: 'Options', align: 'center', sortable: false, value: 'option' }
			],
			pagination: {
				currentPage: 1,
				totalPages: null,
				itemsPerPage: 20,
				selectItemsPerPage: [ 1, 5, 20, 50, 80 ]
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
				const allUsers = res.users

				const loggedInUser = this.getUser
				// Filter logged in user
				const users = allUsers.filter((user) => user.id !== loggedInUser.id)

				if (res.users) {
					this.users = users

					// Handle pagination
					let l = this.users.length
					let s = this.pagination.itemsPerPage
					this.pagination.totalPages = Math.floor(l / s)
					let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
					let end = start + this.pagination.itemsPerPage

					const usersToDisplay = this.users.slice(start, end)

					const usersWithAttachments = await this.getAttachmentsForUsers(usersToDisplay)

					// Set displayed users
					this.displayedUsers = usersWithAttachments
				}
			} catch (error) {
				this.success = null
				this.error = error.response.data.error
				console.log(error)
			}
		},

		async getAttachmentsForUsers(users) {
			try {
				// TODO: Create watcher for visible users which will update the attachments
				let promises = users.map(async(user) => {
					const response = await UserService.getUserAttachment(user.id, 'profile_image')
					if (response && response.data) {
						const blob = response.data || null
						user.profileImage = URL.createObjectURL(blob)
					}
					return user
				})

				const allUsersArr = await Promise.all(promises)
				return allUsersArr
			} catch (err) {
				throw err
			}
		},

		async getUserAttachment(userId, identifier) {
			try {
				const attachment = await UserService.getUserAttachment(userId, identifier)
				return attachment
			} catch (err) {
				throw err
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
			console.log('this: ', this.displayedUsers)
			console.log(this.pagination.itemsPerPage)
		},

		pageChanged() {
			let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
			let end = start + this.pagination.itemsPerPage
			// Change Displayed Articles
			this.displayedUsers = this.users.slice(start, end)
		},

		viewUser(userId, item) {
			event.stopPropagation()
			console.log('props.item: ', item)
			this.$router.push({name: 'admin-view-user', params: { userId: userId }})
		},

		async deleteUser(user) {
			const confirmation = confirm('Are you sure?')

			if (confirmation) {
				try {
					const userId = user.id
					const res = await UserService.deleteUserById(userId)
					const data = res.data
					// If User is deleted successfully
					if (res.status === 200) {
						// Set success message and timeout
						this.error = null
						this.success = data.message
						setTimeout(() => {
							this.success = null
						}, 3000)

						// Reset User list after deleting
						const filteredUsers = this.users.filter(user => user.id !== userId)
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
			// cursor: pointer;

			span {
				font-size: 17px;
			}

			.user-image:hover,
			.user-name:hover,
			.user-username:hover {
				opacity: 0.6;
				cursor: pointer;
			}
		}
		.user-image {
			max-width: 80px;
			max-height: 80px;
			margin-top: 5px;
			margin-left: 5px;
			border-radius: 5px;
		}

		.options {

			button {
				margin-right: 5px;
			}
		}
	}

</style>
