<template>
	<v-btn
		@click="onClick"
		class="logout-btn pink"
	>
		Logout
	</v-btn>
</template>

<script>
// Services
import AuthenticationService from '@/services/AuthenticationService'
// Helpers
import { mapGetters } from 'vuex'

export default {

	computed: {
		...mapGetters(['getUserToken'])
	},

	methods: {
		async onClick() {
			try {
				const token = this.getUserToken
				const res = await AuthenticationService.logout(token)

				if (res.status === 200) {
					// Clear store and local storage data
					const isLoggedOut = await this.$store.dispatch('logoutUser', null)
					const isSettingsRemoved = await this.$store.dispatch('setSettings', null)
					// TODO: Change logic for active page and side navigation
					this.$store.dispatch('setActivePage', null)

					if (isLoggedOut && isSettingsRemoved) {
						// Redirect to admin login page and send success msg
						this.$router.push({
							name: 'admin-login',
							params: { loggedOutMessage: 'Logged out' }
						})
					}
				}
			} catch (error) {
				console.log(error)
				this.success = null
				this.error = error.response.data.error
			}
		}
	}
}
</script>

<style scoped lang="scss">

.logout-btn {
	margin-right: 10px;
	position: fixed;
	top: 25px;
	left: 91%;
	color: white;
}

</style>
