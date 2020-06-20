<template>
	<button
		@click="onClick"
		class="btn logout-btn"
	>
		<font-awesome-icon :icon="['fas', 'sign-out-alt']" class="icon" />
		Logout
	</button>
</template>

<script>
// Services
import AuthService from '@/services/AuthService'
// Helpers
import { mapGetters } from 'vuex'
// Font awesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faSignOutAlt)

export default {
	name: 'LogoutBtn',

	computed: {
		...mapGetters([])
	},

	methods: {
		async onClick() {
			try {
				// Send req to logout the user
				const res = await this.$store.dispatch('logoutUser')

				if (res.status === 200) {
					// Redirect to login page
					this.$router.push({
						name: 'login',
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
	padding: 5px 10px;
	border: 1px solid #fff;
	font-weight: 600;
	color: #fff;

	&:hover {
		color: $red-color;
		border-color: $red-color;
	}

	.icon {
		color: inherit;
		margin-right: 8px;
	}
}

</style>
