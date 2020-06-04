<template>
	<v-flex xs5 offset-xs3>
		<div class="white elevation-5">
			<v-toolbar class="black toolbar" flat dense>
				<v-toolbar-title class="toolbar-title">{{ $props.heading }}</v-toolbar-title>
			</v-toolbar>
			<div class="register-page pl-4 pr-4 pb-3 pt-4">
				<v-form @submit="onSubmit">
					<v-text-field
						type="text"
						v-model="username"
						ref="inputUsername"
						label="Username:"
						outline
					></v-text-field>
					<v-text-field
						type="password"
						v-model="password"
						ref="inputPassword"
						label="Password:"
						outline
					></v-text-field>
					<br>
					<v-btn
						class="green login-button"
						block
						type="submit"
					>
						Login
					</v-btn>
				</v-form>
			</div>

		</div>
	</v-flex>
</template>

<script>
// Services
import LoginService from '@/services/LoginService'
import SettingsService from '@/services/SettingsService'

export default {
	props: {
		heading: {
			type: String,
			default: ''
		},
		selectedUser: {
			type: Object,
			default: {}
		}
	},

	data() {
		return {
			username: '',
			password: ''
		}
	},

	computed: {
		setUsername() {
			return this.$props.selectedUser
		}
	},

	watch: {
		setUsername(val) {
			this.username = val.username
		}
	},

	mounted() {
		let msg = this.$route.params.loggedOutMessage
		if (msg) this.handleLoggingOut(msg)
	},

	methods: {
		async onSubmit() {
			event.preventDefault()
			try {
				// Login
				const loginRes = await LoginService.login({
					username: this.username,
					password: this.password
				})

				// If user login is successfull
				if (loginRes.status === 200) {
					// Success notification
					this.$store.dispatch('addNotification', {
						text: 'Logged in successfully',
						type: 'success'
					})

					const user = loginRes.data.user
					const token = loginRes.data.token
					// Set user in the Vuex Store
					const data = {
						user,
						token
					}

					const isLoggedIn = await this.$store.dispatch('loginUser', data)

					// Get or Create Settings
					const res = await SettingsService.getOrCreateStoreSettings(user._id)
					if (res.data.settings) {
						// Set Settings in the Vuex Store
						var settingsLoaded = await this.$store.dispatch('setSettings', res.data.settings)
					}

					if (isLoggedIn && settingsLoaded) {
						// Redirect admin/root user to admin dashboard
						if (user.roles.includes('admin') || user.roles.includes('root')) {
							return this.$router.push({
								name: 'admin-home'
							})

						// Redirect user to user dashboard
						} else if (user.roles.includes('user')) {
							return this.$router.push({
								name: 'user-home'
							})
						}
					}
				}
			} catch (err) {
				console.log(err.response.data)
				// Error notification
				this.$store.dispatch('addNotification', {
					text: err.response.data.message,
					type: 'error'
				})
			}
		},

		handleSelectedUser(selectedUser) {
			this.username = selectedUser.username
			this.password = ''
			this.$refs.inputPassword.focus()
		},

		handleLoggingOut(logoutMsg) {
			// Error notification
			this.$store.dispatch('addNotification', {
				text: logoutMsg,
				type: 'success'
			})
			this.$refs.inputUsername.focus()
		}
	}
}
</script>

<style scoped lang="scss">

	.toolbar-title {
		color: white;
	}

	.msg-placeholder {
		height: 36px;
	}

</style>
