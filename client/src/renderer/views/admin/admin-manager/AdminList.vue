<template>
	<div class="admin-list">
		<div>
			<admin-side-menu />
		</div>
		<v-layout column class="right-side">
			<v-flex>
				<div class="admin-header">
					<h1 class="heading">Admins</h1>
					<admin-logout-btn />
				</div>
			</v-flex>

			<v-flex class="admin-container">
				<!-- Display messages -->
				<div class="error-msg" v-if="error" v-html="error" />
				<div class="success-msg" v-if="success" v-html="success" />
				<div class="info-msg" v-if="info" v-html="info" />

				<!-- TODO: Add animation for fetching/displaying admins possibly with Scroll Reveal -->
				<!-- List of all admins in the db -->
				<div class="list-of-admins">

					<v-select
						v-model="pagination.itemsPerPage"
						:items="pagination.selectItemsPerPage"
						@change="changePagination"
						label="Items per page"
						class="pagination-items-per-page"
						required
					></v-select>

					<v-pagination
						v-if="pagination.totalPages !== null && pagination.totalPages !== 0"
						v-model="pagination.currentPage"
						:length="pagination.totalPages"
						@input="pageChanged"
					></v-pagination>

					<v-data-table
						:headers="headers"
						:items="displayedAdmins"
						hide-actions
						class="elevation-1"
						dark
					>
						<template slot="items" slot-scope="props">
							<td class="td text-xs-left">
								<img class="admin-image" v-if="props.item.image" :src="`http://localhost:9090/${props.item.image}`" />
							</td>
							<td class="td text-xs-left">
								<span class="admin-name">
									{{ props.item.name }}
								</span>
							</td>
							<td class="td text-xs-left">
								<span class="admin-username">
									{{ props.item.username }}
								</span>
							</td>
							<td class="td text-xs-center">
								<v-btn @click="editAdminPage(props.item._id)" class="edit-btn yellow">Edit</v-btn>
								<v-btn @click="deleteAdmin(props.item)" class="delete-btn white">Delete</v-btn>
							</td>
						</template>
					</v-data-table>

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
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import AdminService from '@/services/AdminService'

export default {
	components: {
		AdminSideMenu
	},
	data() {
		return {
			admins: [],
			displayedAdmins: [],
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
			// Get Admin list
			// TODO: Get all admins except the Root Admin
			const res = await AdminService.getAllAdmins()
			const admins = res.data.admins
			if (admins) {
				const currentLoggedInAdmin = this.$store.state.user.username
				// Add admin in the admins array
				admins.forEach((admin) => {
					// Don't display the currently logged in admin
					if (admin.username === currentLoggedInAdmin || admin.root === true) {
						return false
					} else {
						this.admins.push(admin)
					}
				})

				// Handle pagination
				let l = this.admins.length
				let s = this.pagination.itemsPerPage
				this.pagination.totalPages = Math.floor(l / s)
				let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
				let end = start + this.pagination.itemsPerPage
				// Set Displayed Admins
				this.displayedAdmins = this.admins.slice(start, end)
			}
		} catch (error) {
			this.success = null
			this.error = error.response.data.error
		}
	},

	methods: {
		changePagination() {
			// TODO: Save pagination options in localStorage
			let l = this.admins.length
			let s = this.pagination.itemsPerPage
			this.pagination.totalPages = Math.floor(l / s)
			let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
			let end = start + this.pagination.itemsPerPage
			// Set Displayed Articles
			this.displayedAdmins = this.admins.slice(start, end)
			console.log(this.pagination.itemsPerPage)
		},

		pageChanged() {
			let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
			let end = start + this.pagination.itemsPerPage
			// Change Displayed Articles
			this.displayedAdmins = this.admins.slice(start, end)
		},

		editAdminPage(adminId) {
			this.$router.push({
				name: 'admin-edit-admin',
				params: {adminId}
			})
		},

		async deleteAdmin(admin) {
			let confirmation = confirm('Are you sure?')

			if (confirmation) {
				try {
					const adminId = admin._id
					const imgPath = admin.image
					// TODO: Don't send the image, api should delete all relevant admin data by admin ID
					const response = (await AdminService.deleteAdmin(adminId, imgPath)).data
					// If Admin is deleted successfully
					if (response.deleted) {
						// Set success message and timeout
						this.error = null
						this.success = response.success
						setTimeout(() => {
							this.success = null
						}, 3000)

						// Reset Admin list after deleting
						const filteredAdmins = this.admins.filter(admin => admin._id !== adminId)
						this.admins = filteredAdmins
						// this.displayedAdmins = filteredAdmins
						this.pageChanged()

						// // Reset Admin list after deleting
						// const ress = (await AdminService.getAllAdmins()).data
						// if (ress.admins) {
						// 	this.admins = []
						// 	const currentLoggedInAdmin = this.$store.state.admin.username
						// 	ress.admins.forEach((admin) => {
						// 		// Don't display the currently logged in admin
						// 		if (admin.username === currentLoggedInAdmin) {
						// 			return false
						// 		} else {
						// 			this.admins.push(admin)
						// 		}
						// 	})
						// }
					}
				} catch (error) {
					this.success = null
					this.error = error.response.data.error
				}
			}
		},

		viewAdmin(adminId) {
			this.$router.push({name: 'admin-view-admin', params: {adminId}})
		}
	}
}
</script>

<style scoped lang="scss">

	.list-of-admins {
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
			font-size: 16px;
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

	.list-title {
		font-size: 17px;
	}

</style>
