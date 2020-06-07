<template>
	<!--<div class="login-box white elevation-5">
		 <v-toolbar class="black toolbar" flat dense>
			<v-toolbar-title class="toolbar-title">{{ $props.heading }}</v-toolbar-title>
		</v-toolbar>
		<div class="pl-4 pr-4 pb-3 pt-4">
			<v-form @submit="postLogin">
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
	</div> -->
	<div class="login-box">
		<header>
			<h2>{{ $props.heading }}</h2>
		</header>
		<main>
			<input type="text" v-model="username" ref="inputUsername" placeholder="Username"><br>
			<input type="password" v-model="password" ref="inputPassword" placeholder="Password"><br>
			<button @click="postLogin()">Login</button>
		</main>
	</div>
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

	watch: {
		selectedUser(user) {
			this.handleSelectedUser(user)
		}
	},

	mounted() {
		let msg = this.$route.params.loggedOutMessage
		if (msg) this.handleLoggingOut(msg)
	},

	methods: {
		async postLogin() {
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
				// let myNotification = new Notification('Title', {
				// 	body: 'Lorem Ipsum Dolor Sit Amet'
				// })
				// myNotification.onclick = () => {
				// 	console.log('Notification clicked')
				// }
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

.login-box {
	max-width: 350px;
	margin-left: auto;
	margin-right: auto;
	background-color: #276270;
	// background-color: $blue-color;
	border-radius: 5px;

	header {
		padding: 15px 30px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	header h2 {
		text-align: center;
		color: #fff;
	}
	header h2 small {
		font-size: 16px;
		opacity: 0.5;
	}

	main {
		padding: 20px 30px;

		input[type='text'],
		input[type='password'] {
			width: 100%;
			font-size: 15px;
			padding: 5px 10px;
			margin-bottom: 14px;
			border-radius: 5px;

			color: #fff;
			border: none;
			border-radius: 0;
			border-bottom: 1px solid #333;
			background-color: #276270;
			transition: background-color 150ms ease-in-out;
		}
		input[type='text']::placeholder,
		input[type='password']::placeholder {
			color: rgba(255, 255, 255, 0.8);
			font-weight: 400;
			font-size: 14px;
		}
		input[type='text']:focus,
		input[type='password']:focus {
			outline: none;
			color: #333;
			background-color: #fff;
			border-top-left-radius: 5px;
			border-top-right-radius: 5px;
		}

		button {
			width: 100%;
			margin: 20px 0 0 0;
			padding: 5px 25px;
			color: #fff;
			font-size: 16px;
			background-color: #333;
			border: none;
			border: 1px solid #fff;
			border-radius: 5px;
			transition: background-color 200ms ease-in-out;
			cursor: pointer;
		}
		button:hover {
			background-color: #333;
		}

		.remember-wrapper {
			margin-top: 10px;
		}
		.remember-wrapper input[type='checkbox'] {
			display: inline-block;
			vertical-align: middle;
		}
		.remember-wrapper label {
			font-size: 12px;
			color: #f4f4f4;
			font-weight:600;
			height: 100%;
			vertical-align: middle;
		}
	}

	.message {
		display: block;
		max-width: 350px;
		padding: 10px 10px;
		margin: 15px auto 0 auto;
		text-align: center;
		font-size: 14px;
		background-color: red;
		color: #fff;
		border-radius: 5px;
	}
	.message:empty {
		display: none;
	}
}
</style>
