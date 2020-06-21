	<template>
	<div class="view-storage-page">
		<!-- <v-flex>
			<div class="admin-header">
					<h1 class="heading">
						{{subgroup.name}}
						<v-btn @click="createArticlePage(storage.id, subgroup.id, subgroup.name)" class="green">
							Add Article
						</v-btn>
						<v-btn @click="editArticleSubgroupPage(storage.id, subgroup.id)" class="yellow">
							Edit
						</v-btn>
					</h1>
					<LogoutBtn />
			</div>
		</v-flex> -->

		<h1 class="heading">
			{{ storage.name }}
			
			<button
				:class="[options.storageEditMode ? 'btn-delete' : 'btn-edit']"
				@click="toggleStorageEditMode()"
				ref="editUserBtn"
			>
				{{ options.storageEditMode ? 'Discard' : 'Edit' }}
			</button>
		</h1>

		<StorageForm
			v-if="options.storageEditMode"
			:editMode="options.storageEditMode"
			:storage="storage"
		/>

		<ArticleTable :storageId="storageId" />
	</div>
</template>

<script>
// Services
import StorageService from '@/services/StorageService'
// Components
import ArticleTable from '@/components/tables/Articles'
import StorageForm from '@/components/forms/Storage'

export default {
	components: { ArticleTable, StorageForm },

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
				// console.log('Subgroup _id: ', this.subgroup.id)
				// console.log('Subgroup name: ', this.subgroup.name)
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