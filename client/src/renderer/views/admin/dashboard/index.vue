<template>
	<div class="admin-home">
		<!-- TODO: Article/orders graph component -->
		<!-- TODO: Tax/income graph component -->
	</div>
</template>

<script>
export default {
	components: {},
	
	data() {
		return {
			user_id: this.$store.state.user.id
		}
	},

	mounted() {
		// console.log('store: ', this.$store.state)
	}
}
</script>

<style scoped lang="scss">
	
</style>
