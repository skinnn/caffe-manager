<template>
	<div class="admin-view">
		<div>
			<admin-side-menu />
		</div>
		<v-layout column class="right-side">
			<v-flex>
				<div class="admin-header">
						<h1 class="heading">Taxes</h1>
						<LogoutBtn />
				</div>

				<v-flex class="admin-container">
					<!-- Display messages -->
					<div class="error-msg" v-if="error" v-html="error" />
					<div class="success-msg" v-if="success" v-html="success" />

					<div class="admin-taxes-info">

						<v-data-table
							:headers="headers"
							:items="taxes"
							hide-actions
							class="elevation-1"
						>
							<template slot="items" slot-scope="props">
								<td>{{ props.item.name }}</td>
								<td class="text-xs-right">{{ props.item.calories }}</td>
								<td class="text-xs-right">{{ props.item.fat }}</td>
								<td class="text-xs-right">{{ props.item.carbs }}</td>
								<td class="text-xs-right">{{ props.item.protein }}</td>
								<td class="text-xs-right">{{ props.item.iron }}</td>
							</template>
						</v-data-table>
					</div>

				</v-flex>
			</v-flex>
		</v-layout>
	</div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'

export default {
	components: {
		AdminSideMenu
	},
	data() {
		return {
			taxes: [],
			error: null,
			success: null,
			headers: [
				{
					text: 'Username',
					align: 'left',
					sortable: false,
					value: 'name'
				},
				{ text: 'Name', value: 'name' },
				{ text: 'ID', value: '_id' },
				{ text: 'Carbs (g)', value: 'carbs' },
				{ text: 'Protein (g)', value: 'protein' },
				{ text: 'Iron (%)', value: 'iron' }
			]
		}
	}
}
</script>

<style scoped lang="scss">

	.admin-taxes {
		width: 100%;
	}

	.list-title {
		font-size: 17px;
	}

</style>
