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
			Storage: {{ storage.name }}
		</h1>
		
		<button type="button" class="btn-info" @click="viewDetails(storage)">
			Details
		</button>

		<ArticleTable :storageId="storageId" />
	</div>
</template>

<script>
// Services
import StorageService from '@/services/StorageService'
// Components
import ArticleTable from '@/components/tables/Article'

export default {
	components: { ArticleTable },

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
				const id = this.storageId
				const query = '?include=updated_by,user_id'
				// Get Storage data
				const storageResponse = await StorageService.getStorageById(id, query)
				const storage = storageResponse.data

				this.storage = storage
			} catch (err) {
				console.log(err)
			}
		},

		viewDetails(storage) {
			this.$router.push({
				name: 'admin-storage-view-details',
				storageId: storage.id
			})
		}
	}
}
</script>

<style scoped lang="scss">

</style>