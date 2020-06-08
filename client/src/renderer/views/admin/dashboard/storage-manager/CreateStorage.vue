<template>
	<div class="admin-create-storage-page">
		<v-layout column class="right-side">
			<!-- <v-flex>
				<div class="admin-header">
						<h1 class="heading">
							Create Storage
						</h1>
						<LogoutBtn />
				</div>
			</v-flex> -->

			<v-flex class="admin-container">
				<div class="create-storage">

					<h3>Storage name:</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							type="text"
							maxlength = "35"
							v-model="storage.name"
							label="Example: Storage 1, Main, Alternative 1..."
							solo
						></v-text-field>
					</v-flex>

					<h3>Type:</h3>
					<v-flex xs12 sm5 d-flex>
						<v-select
							:items="select.storageType"
							v-model="storage.type"
							label="Select"
							solo
						></v-select>
					</v-flex>
				</div>

					<!-- Display messages -->
					<div class="error-msg" v-if="error" v-html="error" />
					<div class="success-msg" v-if="success" v-html="success" />
					<div class="info-msg" v-if="info" v-html="info" />

					<v-btn @click="createStorage()" class="yellow">
						Create
					</v-btn>

			</v-flex>
		</v-layout>
	</div>
</template>

<script>
// import AdminSideMenu from '@/components/admin/AdminSideMenu'
import StorageService from '@/services/StorageService'

export default {
	components: {
		// AdminSideMenu
	},
	data() {
		return {
			storage: {
				name: '',
				type: ''
			},
			select: {
				storageType: ['Main', 'Alt']
			},
			// Messages
			error: null,
			success: null,
			info: null
		}
	},
	mounted() {

	},
	methods: {
		async createStorage() {
			try {
				if (this.storage.name !== '' && this.storage.type !== '') {
					const response = (await StorageService.createStorage({
						storageName: this.storage.name,
						type: this.storage.type
					})).data

					if (response.saved) {
						this.error = null
						this.info = null
						this.success = response.success
						setTimeout(() => {
							this.success = null
						}, 3000)
						console.log(response)

						// Reset input fields
						this.storage.name = ''
						this.storage.type = ''
					}
				} else {
					this.success = null
					this.info = null
					this.error = 'Please fill out all required fields.'
				}
			} catch (error) {
				console.log(error)
				this.success = ''
				this.error = error.response.data.error
			}
		}
	}
}
</script>

<style scoped lang="scss">

	.admin-container {

		.create-storage {
			width: 600px;
			max-width: 600px;
			padding: 20px;

			h3 {
				height: 40px;
				display: inline-block;
				width: 370px;
			}
		}
	}

	.list-title {
		font-size: 17px;
	}

</style>
