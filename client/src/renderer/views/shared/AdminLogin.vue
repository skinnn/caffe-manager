<template>
	<v-layout row class="mt-5">
		<v-flex xs5 offset-xs3>
			<div class="white elevation-5">
				<v-toolbar class="black toolbar" flat dense>
					<v-toolbar-title class="toolbar-title">Admin Login</v-toolbar-title>
				</v-toolbar>
				<div class="register-page pl-4 pr-4 pb-3 pt-4">
					<router-link to="/admin/login" event=""><v-btn color="blue">Admin Login</v-btn></router-link>
					<router-link to="/admin/landingpage/register"><v-btn color="blue">Admin Register</v-btn></router-link>
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
						<div class="error-msg" v-if="error" v-html="error" />
						<div class="success-msg" v-if="success" v-html="success" />
						<div class="info-msg" v-if="info" v-html="info" />
						<div class="msg-placeholder" v-if="!info && !success && !error" />
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

		<LoginList :userType="'admins'" @userSelected="handleSelectedUser" />
	</v-layout>
</template>

<script>
// Services
import AuthenticationService from '@/services/AuthenticationService'
import SettingsService from '@/services/SettingsService'
import AdminService from '@/services/AdminService'
import UserService from '@/services/UserService'
// Components
import LoginList from '@/components/LoginList'

export default {
	components: { LoginList },

	data() {
		return {
			adminList: [],
			username: '',
			password: '',
			// Messages
			error: null,
			success: null,
			info: null,
			// adminList: false,
			loggedOutMessage: this.$store.state.route.params.loggedOutMessage
		}
	},

	methods: {
		async getAdminLoginList() {
			try {
				const response = (await AdminService.getAdminLoginList()).data
				// console.log(response)

				if (response.admins) {
					// this.adminList = null
					response.admins.forEach((admin) => {
						this.adminList.push(admin)
					})
				}
			} catch (err) {
				console.error(err)
			}
		},

		async onSubmit() {
			event.preventDefault()
			try {
				// Login
				const loginRes = await AuthenticationService.login({
					username: this.username,
					password: this.password
				})

				console.log('loginRes: ', loginRes)

				// If user login is successfull
				if (loginRes.status === 200) {
					// Hide errors
					this.success = 'You are now logged in'
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
					const res = await SettingsService.getOrCreateStoreSettings(token, user._id)
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
