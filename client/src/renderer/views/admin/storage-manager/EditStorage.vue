<template>
	<div class="admin-edit">
		<div>
			<admin-side-menu />
		</div>
		<v-layout column class="right-side">
			<v-flex>
				<div class="admin-header">
						<h1 class="heading">
							Edit Storage: {{storage.name}}
							<v-btn @click="saveStorage(storage._id)" class="yellow">
								Save
							</v-btn>
						</h1>
						<LogoutBtn />
				</div>
			</v-flex>

			<v-flex class="admin-container">
				<!-- Display messages -->
				<div class="error-msg" v-if="error" v-html="error" />
				<div class="success-msg" v-if="success" v-html="success" />

				<div class="admin-edit-storage">

					<label>Storage name:</label>
					<v-text-field
						type="text"
						v-model="storage.name"
						outline
					></v-text-field>
				</div>

			</v-flex>
		</v-layout>
	</div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import StorageService from '@/services/StorageService'

export default {
	components: {
		AdminSideMenu
	},
	data() {
		return {
			storage: {},
			error: null,
			success: null
		}
	},
	async mounted() {
		try {
			const storageId = this.$store.state.route.params.storageId
			const response = (await StorageService.getStorageById(storageId)).data

			if (response.storage) {
				this.storage = response.storage
			}
		} catch (error) {
			this.success = null
			this.error = error.response.data.error
		}
	},
	methods: {
		async saveStorage(storageId) {
			try {
				// Save storage
				const response = (await StorageService.saveStorage(this.storage)).data
				console.log(response)
				// If successfully saved
				// if (response.saved) {
				//   this.$router.push({
				//     name: 'admin-view-storage',
				//     params: {storageId}
				//   })
				// }
			} catch (error) {
				this.success = null
				this.error = error.response.data.error
			}
		}
	}
}
</script>

<style scoped lang="scss">

	.admin-edit-storage {
		width: 100%;
	}

	.list-title {
		font-size: 17px;
	}

</style>
