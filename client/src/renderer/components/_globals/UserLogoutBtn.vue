<template>
	<v-btn @click="onClick" class="logout-btn pink">
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
				const token = await this.getUserToken
				const response = (await AuthenticationService.logout(token)).data

				if (response.user === false) {
					// Set user and isLoggedIn states to false
					this.$store.dispatch('setUser', null)
					// Redirect to user login page and send success msg
					await this.$router.push({
						name: 'user-login',
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
