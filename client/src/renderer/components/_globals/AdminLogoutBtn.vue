<template>
	<v-btn @click="logoutAdmin" class="logout-btn pink">
		Logout
	</v-btn>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
	methods: {
		async logoutAdmin() {
			try {
				const response = (await AuthenticationService.logoutAdmin()).data

				if (response.admin === false) {
					// Clear store and local storage data
					this.$store.dispatch('logoutAdmin', null)
					this.$store.dispatch('setSettings', null)
					// TODO: Change logic for active page and side navigation
					this.$store.dispatch('setActivePage', null)

					console.log('App state cleared: ', this.$store.state)

					// Redirect to admin login page and send success msg
					this.$router.push({
						name: 'admin-login',
						params: { loggedOutMessage: 'Logged out' }
					})
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
