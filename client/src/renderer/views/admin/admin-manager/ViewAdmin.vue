<template>
	<div class="admin-view">
		<div>
			<admin-side-menu />
		</div>
		<v-layout column class="right-side">
			<v-flex>
				<div class="admin-header">
						<h1 class="heading">
							Admin: {{admin.name}}
							<v-btn @click="editAdmin(admin._id)" class="yellow">
								Edit
							</v-btn>
						</h1>
						<admin-logout-btn />
				</div>
			</v-flex>

			<v-flex class="admin-container">
				<!-- Display messages -->
				<div class="error-msg" v-if="error" v-html="error" />
				<div class="success-msg" v-if="success" v-html="success" />

				<div class="admin-info">
					<p>Username: {{admin.username}}</p>
					<p>ID: {{admin._id}}</p>
					<p>Full name: {{admin.name}}</p>
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
			admin: {},
			error: null,
			success: null
		}
	},
	async mounted() {
		try {
			const adminId = this.$store.state.route.params.adminId
			const response = (await AdminService.getAdminById(adminId)).data

			if (response.admin) {
				this.admin = response.admin
			}
		} catch (error) {
			this.success = null
			this.error = error.response.data.error
		}
	},
	methods: {
		editAdmin(adminId) {
			this.$router.push({name: 'admin-edit-admin', params: {adminId}})
		}
	}
}
</script>

<style scoped lang="scss">

	.admin-info {
		width: 100%;
	}

	.list-title {
		font-size: 17px;
	}

</style>
