<template>
	<div id="app">
		<!-- TODO: Remove when vuetify is removed -->
		<v-app>
			<router-view></router-view>
			<!-- <GlobalNotifications /> -->
		</v-app>
	</div>
</template>

<script>
	// Components
	import UserSideMenu from '@/components/user/UserSideMenu'
	import GlobalNotifications from '@/components/notices/GlobalNotifications'

	export default {
		components: {	
			UserSideMenu,
			GlobalNotifications
		},

		created() {
			// process.env.NODE_ENV === 'production' ? this.init() : null
			// this.init()
		},

		methods: {
			init() {
				this.$store.dispatch('logoutUser')
				this.$router.push('login')
			}
		}
	}
</script>

<style lang="scss">
	#app {
		// user-select: none;
	}
</style>
