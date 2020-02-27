<template>
	<div>
		<!-- mini-variant option instead of permanent can be used for tablet devices -->
		<v-navigation-drawer stateless permanent fixed width="260">
			<v-toolbar flat>
				<v-list>
					<v-list-tile>
						<v-list-tile-title class="title">
								<v-icon>settings</v-icon>
								{{ $store.state.user.username }}
						</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-toolbar>

			<v-divider></v-divider>

			<v-list class="pt-0 pb-0">
				<v-list-tile
					v-for="item in this.userMenu"
					:key="item.title"
					@click="navigateTo(item.route)"
				>
					<v-list-tile-action>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-tile-action>

					<v-list-tile-content>
						<v-list-tile-title class="list-title">
							{{ item.title }}
						</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
	</div>
</template>

<script>

export default {
	data() {
		return {
			userMenu: []
		}
	},
	methods: {
		navigateTo(route) {
			this.$router.push(route)
		}
	},
	mounted() {
		const loggedInUser = this.$store.state.user

		if (this.$store.state.isUserLoggedIn === true) {
			// Add home to the menu by default
			const home = loggedInUser.userMenu[2]
			this.userMenu.push(home)

			// If permission is granted add tables to the menu
			if (loggedInUser.userMenu[1].tables) {
				const tables = loggedInUser.userMenu[1]
				this.userMenu.push(tables)
			}

			// If permission is granted add warehouse to the menu
			if (loggedInUser.userMenu[0].warehouse) {
				const warehouse = loggedInUser.userMenu[0]
				this.userMenu.push(warehouse)
			}
		}

		// console.log('Current menu is: ', this.userMenu)
	}
}
</script>

<style scoped lang="scss">

	.my-class {
		background-color: red;
	}

	.list-title {
		font-size: 17px;
	}

</style>
