<template>
	<div id="app">
		<!-- TODO: Remove v-app when vuetify is removed -->
		<v-app>
			<router-view></router-view>
		</v-app>
	</div>
</template>

<script>
	// Services
	import AuthService from '@/services/AuthService'
	
	export default {

		async mounted() {
			try {
				const isUserLoggedIn = this.$store.getters.isLoggedIn
				if (isUserLoggedIn) {
					const res = await this.$store.dispatch('logoutUser')
					this.$router.push({ name: 'login' })
				}
			} catch (err) {
				this.$store.dispatch('clearToken')
				this.$store.dispatch('clearUser')
				this.$router.push({ name: 'login' })
				throw err
			}
		}
	}
</script>