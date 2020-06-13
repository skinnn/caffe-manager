<template>
	<div class="admin-edit">
		<v-layout column class="right-side">
			<!-- <v-flex>
				<div class="admin-header">
						<h1 class="heading">
							Edit Admin: {{admin.name}}
						</h1>
						<LogoutBtn />
				</div>
			</v-flex> -->

			<v-flex class="admin-container">
				<!-- Display messages -->
				<div class="error-msg" v-if="error" v-html="error" />
				<div class="success-msg" v-if="success" v-html="success" />

				<div class="admin-edit">

					<!-- TODO: Add the rest of the fields so they can be updated as well - same as Edit User -->
					<label>Username:</label>
					<v-text-field
						type="text"
						v-model="admin.username"
						outline
					></v-text-field>

					<label>Full name:</label>
					<v-text-field
						type="text"
						v-model="admin.name"
						outline
					></v-text-field>

					<v-btn
						@click="onClick(admin.id)"
						class="yellow"
					>
						Save
					</v-btn>
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
	// components: { AdminSideMenu },

	data() {
		return {
			admin: {},
			error: null,
			success: null
		}
	},

	computed: {
		...mapGetters([])
	},

	async mounted() {
		try {
			// TODO: Create editingUser state in the user store module
			const data = { id: this.$store.state.route.params.adminId }
			console.log('data: ', data)
			const response = (await UserService.getUserById(data)).data

			if (response.admin) {
				this.admin = response.admin
			}
		} catch (error) {
			this.success = null
			this.error = error.response.data.error
		}
	},
	methods: {
		async onClick(adminId) {
			try {
				// Save Admin
				const response = (await AdminService.updateAdmin(this.admin)).data

				// Set success message and timeout
				this.success = response.success
				setTimeout(() => {
					this.success = null
				}, 3000)
			} catch (error) {
				this.success = null
				this.error = error.response.data.error
			}
		}
	}
}
</script>

<style scoped lang="scss">

	.admin-edit {
		width: 100%;
	}

	.list-title {
		font-size: 17px;
	}

</style>
