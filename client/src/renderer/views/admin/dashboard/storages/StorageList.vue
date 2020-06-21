<template>
	<div class="storage-list-page">

		<!-- <ul class="storage-list">
			<li
				v-for="storage in storages"
				:key="storage.id"
				@click="viewStorage(storage)"
			>
				<font-awesome-icon :icon="['fas', 'box-open']" class="icon"></font-awesome-icon>
				<span class="name">{{ storage.name }}</span>
				<span class="type">({{ storage.type }})</span>
				<span class="active">{{ storage.active ? 'Active' : 'Not active' }}</span>
				<span class="article-number">(2312 items)</span>
			</li>
		</ul> -->

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
			:items="displayedStorages"
			hide-actions
			class="storage-table elevation-1"
			dark
		>
			<template slot="items" slot-scope="{item}"> <!-- { item } -->
				<td class="td text-xs-left">
					<!-- <img @click="viewStorage(props.item)" class="storage-avatar" /> -->
					<font-awesome-icon :icon="['fas', 'box-open']" class="icon"></font-awesome-icon>
				</td>
				<td class="td text-xs-left">
					<span @click="viewStorage(item)" class="storage-name clickable">
						{{ item.name }}
					</span>
				</td>
				<td class="td text-xs-left">
					<span class="storage-type">
						{{ item.type }}
					</span>
				</td>
				<td class="td text-xs-left">
					<span class="storage-active">
						<span v-if="item.active" class="active">Active</span>
						<span v-else class="inactive">Inactive</span>
					</span>
				</td>
				<td class="td text-xs-center options">
					<!-- <button @click="deleteStoage(item)" class="btn-delete">Delete</button> -->
					<button @click="viewStorage(item)" class="btn-view">View</button>
				</td>
			</template>
		</v-data-table>

	</div>
</template>

<script>
// Services
import StorageService from '@/services/StorageService'
// Font Awesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons'
library.add(faBoxOpen)

export default {
	
	data() {
		return {
			storages: [],
			displayedStorages: [],

			// Table data
			headers: [
				{ text: 'Avatar', align: 'left', sortable: false },
				{ text: 'Name', align: 'left', sortable: true, value: 'name' },
				{ text: 'Type', sortable: true, value: 'type' },
				{ text: 'Active (in use)', sortable: true, value: 'roles' },
				{ text: 'Options', align: 'center', sortable: false, value: 'option' }
			],
			pagination: {
				currentPage: 1,
				totalPages: null,
				itemsPerPage: 20,
				selectItemsPerPage: [ 1, 5, 20, 50, 80 ]
			}
		}
	},
	
	async mounted() {
		try {
			// Get storages
			const res = await StorageService.getAllStorages()
			const storages = res.data

			if (res.status === 200) {
				this.storages = storages

				// Handle pagination
				let l = this.storages.length
				let s = this.pagination.itemsPerPage
				this.pagination.totalPages = Math.floor(l / s)
				let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
				let end = start + this.pagination.itemsPerPage

				// Set displayed storages
				this.displayedStorages = this.storages.slice(start, end)
			}
		} catch (err) {
			console.log(err)
			this.$store.dispatch('addNotification', {
				type: 'error',
				test: err.response.data.message
			})
		}
	},

	methods: {

		viewStorage(storage) {
			this.$router.push({
				name: 'admin-storage-view',
				params: {
					storageId: storage.id,
					storageName: storage.name
				}
			})
		},

		deleteStoage() {
			// TODO: Verify admin password first
		}
	}
}
</script>

<style scoped lang="scss">

	.storage-list-page {
		
		.storage-table {
			list-style: none;

			.icon {
				font-size: 24px;
			}

			.storage-name {
				font-size: 16px;
			}

			.storage-active {
				span {
					padding: 5px;
					border-radius: 3px;
				}

				.active {
					background-color: $success;
				}

				.inactive {
					background-color: $error;
				}
			}
		}
	}

</style>
