<template>
	<div class="admin-home">
		<div class="info-wrapper">
			<p>Name: <span class="info-data">{{user.name}}</span></p>
			<p>Username: <span class="info-data">{{user.username}}</span></p>
			<p>Phone: <span class="info-data">{{user.phone}}</span></p>
			<p>Address: <span class="info-data">{{user.address}}</span></p>
			<p>Last time updated: <span class="info-data">{{user.updated}}</span></p>
			<p>Last update by: <span class="info-data">{{user.updated_by}}</span></p>
			<p>Created: <span class="info-data">{{user.created}}</span></p>
		</div>
	</div>
</template>

<script>
export default {
	components: {},
	
	data() {
		return {
			user: {
				name: this.$store.state.user.name,
				username: this.$store.state.user.username,
				phone: this.$store.state.user.phone,
				address: this.$store.state.user.address,
				updated: this.$store.state.user.updated,
				updated_by: this.$store.state.user.updated_by
			},
			user_id: this.$store.state.user.id,
			error: null,
			success: null,
			info: null
		}
	},

	mounted() {
		// console.log('STORE: ', this.$store.state)
	}
}
</script>

<style scoped lang="scss">
	.activeHome {
		background-color: red
	}
	.admin-container {

		.info-wrapper {
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
