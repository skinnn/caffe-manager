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

					<v-form @keyup.enter.native="loginAdmin">
						<v-text-field
							type="text"
							v-model="username"
							label="Username:"
							outline
							></v-text-field>
						<v-text-field
							id="pwFocus"
							type="password"
							v-model="password"
							label="Password:"
							outline
							></v-text-field>
					</v-form>
					<!-- Display messages -->
					<div class="error-msg" v-if="error" v-html="error" />
					<div class="success-msg" v-if="success" v-html="success" />
					<div class="info-msg" v-if="info" v-html="info" />
					<div class="msg-placeholder" v-if="!info && !success && !error" />
					<br>
					<v-btn class="green login-button"
						block
						@click="loginAdmin">
						Login
					</v-btn>
				</div>

			</div>
		</v-flex>
		<v-flex xs4>
			<div class="elevation-5">
				<ul class="adminList">
					<h3 v-if="adminList.length < 1" class="adminListEmptyText">{{noAdmins}}</h3>
					<li
						v-for="admin in this.adminList"
						:key="admin.username"
						@click="populateUsername(admin.username)"
						class="singleAdminLi"
					>
					<div class="singleAdminDiv">{{admin.name}}</div>
					</li>
				</ul>

			</div>
		</v-flex>
	</v-layout>
</template>

<script>
// Services
import AuthenticationService from '@/services/AuthenticationService'
import SettingsService from '@/services/SettingsService'
import AdminService from '@/services/AdminService'

export default {
	data() {
		return {
			adminList: [],
			username: '',
			password: '',
			// Messages
			error: null,
			success: null,
			info: null,
			noAdmins: null,
			loggedOutMessage: this.$store.state.route.params.loggedOutMessage
		}
	},
	async mounted() {
		const response = (await AdminService.getAdminLoginList()).data
		console.log(response)
		if (response.admins) {
			this.noAdmins = null
			let adminList = this.adminList
			response.admins.forEach(function(admin) {
				adminList.push(admin)
			})
		}
		// If there are no Admins in the DB (root_user doesnt count)
		if (response.noAdmins) {
			this.noAdmins = response.noAdmins
		}
		// TODO: Fire this only if admin logged out
		if (this.loggedOutMessage) {
			this.success = this.loggedOutMessage
			await setTimeout(() => {
				this.success = null
			}, 3000)
			this.loggedOutMessage = null
		}
	},
	methods: {
		populateUsername(username) {
			this.username = username
			this.password = ''
			document.getElementById('pwFocus').focus()
		},

		async loginAdmin() {
			try {
				// Admin Login
				const res = await AuthenticationService.loginAdmin({
					username: this.username,
					password: this.password
				})
				const admin = res.data.admin
				const token = res.data.token
				// If Admin login is successfull
				if (admin) {
					// Hide errors
					this.success = 'You are now logged in'
					this.error = null

					// Set Admin in the Vuex Store
					this.$store.dispatch('loginAdmin', admin, token)

					// Get or Create Settings
					const res = (await SettingsService.getOrCreateAdminSettings(admin._id)).data
					if (res.settings) {
						// Set Settings in the Vuex Store
						this.$store.dispatch('setSettings', res.settings)
					}

					// Redirect to the Admin Home page
					this.$router.push({
						name: 'admin-home'
					})
				}
			} catch (err) {
				console.error(err)
				this.success = null
				this.error = err.response.data.error.message
			}
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

	.adminList {
		list-style: none;
		display: table;
		position: fixed;
		min-height: 415px;
		min-width: 430px;
		padding: 0 10px 0 10px;
		left: 67%;
		border: 1px solid grey;
		border-radius: 5px;
		background-color: lighten(grey, 40);

		.singleAdminLi {
			cursor: pointer;
			list-style: none;
			text-align: left;
			font-size: 18px;
			margin: 10px 0 0 0;
			&:hover {
				.singleAdminDiv {
					background-color: lighten(green, 40);
					border-left: 2px solid green;
				}
			}

			.singleAdminDiv {
				min-height: 50px;
				background-color: lighten(green, 55);
				padding: 10px;
				border-radius: 10px;
				display: table;
			}
		}

		.adminListEmptyText {
			text-align: center;
			font-size: 20px;
		}
	}

</style>
