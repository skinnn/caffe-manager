<template>
	<div class="admin-home">
		<div>
			<admin-side-menu />
		</div>
		<v-layout column class="right-side">
			<v-flex>
				<div class="admin-header">
						<h1 class="heading">Dashboard</h1>
						<admin-logout-btn />
				</div>
			</v-flex>

			<v-flex class="admin-container">
				<!-- Display messages -->
				<!-- TODO: Create separate Message component and add v-alert to all components for styling messages -->
				<div class="error-msg" v-if="error" v-html="error" />
				<div class="success-msg" v-if="success" v-html="success" />
				<div class="info-msg" v-if="info" v-html="info" />

				<div class="admin-info">
					<!-- TODO: Create admin profile page and option to edit profile -->
					<!-- <p>Name: <span class="info-data">{{admin_info.name}}</span></p>
					<p>Username: <span class="info-data">{{admin_info.username}}</span></p>
					<p>Telephone 1: <span class="info-data">{{admin_info.telephone1}}</span></p>
					<p>Telephone 2: <span class="info-data">{{admin_info.telephone2}}</span></p>
					<p>Address: <span class="info-data">{{admin_info.address}}</span></p>
					<p>Last time updated: <span class="info-data">{{admin_info.updated_date}}</span></p> -->
				</div>

			</v-flex>
		</v-layout>
	</div>
</template>

<script>
// Components
import AdminSideMenu from '@/components/admin/AdminSideMenu'

export default {
	components: {
		AdminSideMenu
	},
	data() {
		return {
			admin_info: {
				name: this.$store.state.user.name,
				username: this.$store.state.user.username,
				telephone1: this.$store.state.user.telephone1,
				telephone2: this.$store.state.user.telephone2,
				address: this.$store.state.user.address,
				updated_date: this.$store.state.user.updated_date
			},
			ownerId: this.$store.state.user._id,
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
