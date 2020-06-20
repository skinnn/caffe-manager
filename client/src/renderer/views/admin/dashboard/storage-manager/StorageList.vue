<template>
	<div class="admin-storage-list-page">

		<ul class="storage-list">
			<li
				v-for="storage in storages"
				:key="storage.id"
				@click="viewStorage(storage)"
			>
				<font-awesome-icon :icon="['fas', 'box-open']" class="icon"></font-awesome-icon>
				<span class="name">{{ storage.name }}</span>
				<span class="type">({{ storage.type }})</span>
				<span class="active">{{ storage.active ? 'Active' : 'Not active' }}</span>
				<!-- TODO: Get article count for the storage -->
				<span class="article-number">(2312 items)</span>
			</li>
		</ul>

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
			error: null,
			success: null
		}
	},
	
	async mounted() {
		try {
			// Get storages
			const res = await StorageService.getAllStorages()
			const storages = res.data
			console.log(storages)

			if (res.status === 200) {
				this.storages = storages
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
		}
	}
}
</script>

<style scoped lang="scss">

	.admin-storage-list-page {
		
		ul.storage-list {
			list-style: none;

			li {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				padding: 10px 10px;
				border-radius: 5px;

				&:hover {
					cursor: pointer;
					background-color: #fff;
				}

				.icon {
					font-size: 24px;
				}

				span {
					margin-left: 10px;
				}
			}
		}
	}

</style>
