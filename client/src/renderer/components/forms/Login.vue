<template>
	<div class="login-box-wrapper">
		<div class="login-box">
			<header>
				<h2>{{ $props.heading }}</h2>
			</header>
			<main>
				<form @submit="postLogin()">
					<input type="text" v-model="username" ref="inputUsername" placeholder="Username"><br>
					<input type="password" v-model="password" ref="inputPassword" placeholder="Password"><br>
					<button type="submit">Login</button>
				</form>
			</main>
		</div>
		<div class="message"
			ref="messageEl"
		>
			{{ message }}
		</div>
	</div>
</template>

<script>
// Services
import AuthService from '@/services/AuthService'

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
			username: 'admin',
			password: '123123',
			message: ''
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
		this.$refs.inputUsername.focus()
	},

	methods: {
		async postLogin() {
			event.preventDefault()
			try {
				const data = { username: this.username, password: this.password }
				// Send req to login
				const res = await this.$store.dispatch('loginUser', data)
				var user = res.data.user

				if (res.status === 200) {
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
			} catch (err) {
				console.error(err)
				// Error message
				this.showMessage('error', err.response.data.message)
			}
		},

		handleSelectedUser(selectedUser) {
			this.username = selectedUser.username
			this.password = ''
			this.$refs.inputPassword.focus()
		},

		handleLoggingOut(logoutMsg) {
			this.$refs.inputUsername.focus()
			this.showMessage('success', logoutMsg)
			setTimeout(() => {
				this.hideMessage()
			}, 3000)
		},

		showMessage(type, text) {
			this.$refs.messageEl.classList = `message ${type}` 
			this.message = text
		},

		hideMessage() {
			this.$refs.messageEl.classList = 'message'
			this.message = ''
		}
	}
}
</script>

<style scoped lang="scss">
.login-box-wrapper {
	margin-top: 6%;

	.login-box {
		max-width: 350px;
		margin-left: auto;
		margin-right: auto;
		background-color: $dark-color;
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
				border-top-left-radius: 5px;
				border-top-right-radius: 5px;
				border-bottom: 1px solid $blue-color;
				background-color: $dark-color;
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
			}

			button {
				width: 100%;
				margin: 20px 0 0 0;
				padding: 5px 25px;
				color: #fff;
				font-size: 16px;
				background-color: $blue-color;
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
	}

	.message {
		display: block;
		max-width: 350px;
		padding: 10px 10px;
		margin: 15px auto 0 auto;
		text-align: center;
		font-size: 14px;
		border: 1px solid transparent;
		border-radius: 5px;
	}

	.error {
		color: $error;
		background-color: #fff !important;
		border: 1px solid $error;
	}

	.success {
		color: $success;
		background-color: #fff !important;
		border: 1px solid $success
	}
}
</style>
