<template>
	<div class="admin-home">
		<div class="admin-info">
			<p>TEST</p>
			<!-- TODO: Create admin profile page and option to edit profile -->
			<p>Name: <span class="info-data">{{admin_info.name}}</span></p>
			<p>Username: <span class="info-data">{{admin_info.username}}</span></p>
			<p>Telephone 1: <span class="info-data">{{admin_info.telephone1}}</span></p>
			<p>Telephone 2: <span class="info-data">{{admin_info.telephone2}}</span></p>
			<p>Address: <span class="info-data">{{admin_info.address}}</span></p>
			<p>Last time updated: <span class="info-data">{{admin_info.updated}}</span></p>
		</div>
	</div>
</template>

<script>
export default {
	components: {},
	
	data() {
		return {
			admin_info: {
				name: this.$store.state.user.name,
				username: this.$store.state.user.username,
				telephone1: this.$store.state.user.telephone1,
				telephone2: this.$store.state.user.telephone2,
				address: this.$store.state.user.address,
				updated: this.$store.state.user.updated
			},
			user_id: this.$store.state.user._id,
			error: null,
			success: null,
			info: null
		}
	},

	mounted() {
		console.log('STORE: ', this.$store.state)
		// TODO: Get and populate admin info from the database instead of Vuex Store
	}
}
</script>

<style scoped lang="scss">
	.activeHome {
		background-color: red
	}
	.admin-container {

		.admin-info {
			p {
				font-size: 17px;
				color: darken(grey, 10);
			}

			.info-data {
				font-weight: 600;
				color: black;
			}
		}
	}

	.list-title {
		font-size: 17px;
	}

</style>
