<template>
	<div class="tax-graph-page">
		<p>Tax graph</p>
	</div>
</template>

<script>
// import AdminSideMenu from '@/components/admin/AdminSideMenu'

export default {
	components: {
		// AdminSideMenu
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
