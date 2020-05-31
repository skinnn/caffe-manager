<template>
	<v-flex xs5 offset-xs3>
		<div class="white elevation-5">
			<v-toolbar class="black toolbar" flat dense>
				<v-toolbar-title class="toolbar-title">{{ $props.heading }}</v-toolbar-title>
			</v-toolbar>
			<div class="register-page pl-4 pr-4 pb-3 pt-4">
				<router-link to="/admin-login"><v-btn color="blue">Admin Login</v-btn></router-link>
				<!-- <router-link to="/admin/landingpage/register"><v-btn color="blue">Admin Register</v-btn></router-link> -->
				<router-link to="/"><v-btn color="blue">User Login</v-btn></router-link>

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
					<div class="error-msg" v-if="messages.error" v-html="messages.error" />
					<div class="success-msg" v-if="messages.success" v-html="messages.success" />
					<div class="info-msg" v-if="messages.info" v-html="messages.info" />
					<div class="msg-placeholder" v-if="!messages.info && !messages.success && !messages.error" />
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
			password: '',
			// Messages
			messages: {
				error: null,
				success: null,
				info: null
			}
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
		if (this.$route.params.loggedOutMessage) this.handleLoggingOut()
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
					// Hide errors
					this.info = null
					this.success = null
					this.error = null

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
						var isSettingsSet = await this.$store.dispatch('setSettings', res.data.settings)
					}

					if (isLoggedIn && isSettingsSet) {
						// Redirect to the Admin Home page
						this.$router.push({
							name: 'admin-home'
						})
					}
				}
			} catch (err) {
				console.error(err)
				this.success = null
				this.error = err.response.data.error.message
			}
		},

		handleSelectedUser(selectedUser) {
			this.username = selectedUser.username
			this.password = ''
			this.$refs.inputPassword.focus()
		},

		handleLoggingOut() {
			this.messages.success = this.$route.params.loggedOutMessage
			setTimeout(() => {
				this.messages.success = null
			}, 3000)
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
