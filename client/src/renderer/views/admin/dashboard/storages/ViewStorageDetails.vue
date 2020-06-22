	<template>
	<div class="storage--view-details">
		<h1 class="heading">
			Storage: {{ storage.name }}
			
			<button
				:class="[options.storageEditMode ? 'btn-delete' : 'btn-info']"
				@click="toggleStorageEditMode()"
				ref="editUserBtn"
			>
				{{ options.storageEditMode ? 'Discard' : 'Edit' }}
			</button>
		</h1>

		<StorageForm
			:editMode="options.storageEditMode"
			:storage="storage"
		/>
	</div>
</template>

<script>
// Services
import StorageService from '@/services/StorageService'
// Components
import StorageForm from '@/components/forms/Storage'

export default {
	components: { StorageForm },

	data() {
		return {
			storageId: this.$store.state.route.params.storageId,
			storage: {},

			options: {
				storageEditMode: false
			},

			form: {
				fields: {
					name: ''
				}
			}
		}
	},

	mounted() {
		this.getStorageById()
	},

	methods: {
		async getStorageById() {
			try {
				let storageId = this.storageId
				// Get Storage data
				const storageResponse = await StorageService.getStorageById(storageId)
				const storage = storageResponse.data

				this.storage = storage
			} catch (err) {
				console.log(err)
			}
		},

		toggleStorageEditMode() {
			this.options.storageEditMode = !this.options.storageEditMode
		}
	}
}
</script>

<style scoped lang="scss">

</style>