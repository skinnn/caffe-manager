<template>
	<div id="app">
		<!-- <v-container fluid class="container-fluid pt-0"> -->
			<!-- TODO: Remove when vuetify is removed -->
			<v-app>
				<router-view></router-view>
				<!-- <GlobalNotifications /> -->
			</v-app>
		<!-- </v-container> -->
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
			this.init()
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

	/* Global scrollbar */
	::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}/* Track */
	::-webkit-scrollbar-track {
		background: #f1f1f1; 
	}
	/* Handle */
	::-webkit-scrollbar-thumb {
		background: rgba(51, 51, 51, 0.2); 
		border-radius: 20px;
		padding-left: 3px;
	}
	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		/* background: #555; */
		background: rgba(51, 51, 51, 0.6); 
	}

	.container-fluid {
		max-height: 100vh;
		padding: 0 0;
	}

	.v-list__group__header {
		background-color: #f4f4f4;

		.v-list__group__header__append-icon {
			padding-left: 0;
			padding-right: 10px;
		}

		&:hover {
			color: grey;
		}
	}

	.v-list__tile--link {
		// background-color: #f4f4f4;

		&:hover {
			color: grey;
		}
	}

	.admin-container {
		margin-top: 100px;
		margin-left: 0;
		height: 100%;
		width: 100%;
		// margin-left: 40px;
	}

	.user-container {
		height: 100%;
		width: 100%;
		// margin-left: 40px;
	}

	.right-side {
		margin-left: 236px;
		// width: 100%;
	}

	.admin-header {
		position: fixed;
		height: 100px;
		width: calc(100% - 260px); /* where 260px is width of admin side menu */
		color: white;
		background-color: #3d3d3d;
		border-bottom: 1px solid white;
		z-index: 1;
	}

	.heading {
		position: relative;
		top: 25px;
		left: 6%;
		font-size: 31px;
	}

	.error-msg {
		background-color: pink;
		color: red;
		border-radius: 5px;
		padding: 7px;
		text-align: center;
		font-size: 15px;
	}

	.success-msg {
		background-color: #b2ffb2;
		color: green;
		border-radius: 5px;
		padding: 7px;
		text-align: center;
		font-size: 15px;
	}

	.info-msg {
		background-color: #add8e6;
		color: blue;
		border-radius: 5px;
		padding: 7px;
		text-align: center;
		font-size: 15px;
	}

</style>
