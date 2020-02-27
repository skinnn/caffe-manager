<template>
	<v-layout row class="mt-5">
		<v-flex xs5 offset-xs3>
			<div class="white elevation-5">
				<v-toolbar class="black toolbar" flat dense>
					<v-toolbar-title class="toolbar-title">User Login</v-toolbar-title>
				</v-toolbar>
				<div class="register-page pl-4 pr-4 pb-3 pt-4">
					<router-link to="/admin/login"><v-btn color="blue">Admin Login</v-btn></router-link>
					<router-link to="/admin/landingpage/register"><v-btn color="blue">Admin Register</v-btn></router-link>
					<router-link to="/" event=""><v-btn color="blue">User Login</v-btn></router-link>

					<v-form @keyup.enter.native="loginUser">
						<v-text-field
							type="text"
							v-model="username"
							label="Username:"
							outline
							></v-text-field>
						<v-text-field
							id="pwFocus"
							type="password"
							ref="inputPassword"
							v-model="password"
							label="Password:"
							outline
							></v-text-field>
					</v-form>

					<div class="error-msg" v-if="error" v-html="error" />
					<div class="success-msg" v-if="success" v-html="success" />
					<div class="info-msg" v-if="info" v-html="info" />
					<div class="msg-placeholder" v-if="!info && !success && !error" />
					<br>
					<v-btn class="green login-button"
						block
						@click.prevent="loginUser">
						Login
					</v-btn>
				</div>

			</div>
		</v-flex>

		<LoginList :userType="'users'" @userSelected="handleSelectedUser" />
		<!-- <v-flex xs4>
			<div class="elevation-5">
				<ul class="userList">
					<h3 v-if="userList.length < 1" class="userListEmptyText">{{noUsers}}</h3>
					<li
						v-for="user in this.userList"
						:key="user.username"
						@click="populateUsername(user.username)"
						class="singleUserLi"
					>
					<div class="singleUserDiv">{{user.name}}</div>
					</li>
				</ul>

			</div>
		</v-flex> -->
	</v-layout>
</template>

<script>
// Components
import LoginList from '@/components/LoginList'
// Services
import AuthenticationService from '@/services/AuthenticationService'
import AdminService from '@/services/AdminService'

export default {

	components: { LoginList },

	data() {
		return {
			userList: [],
			username: '',
			password: '',
			// Messages
			error: null,
			success: null,
			info: null,
			noUsers: null,
			loggedOutMessage: this.$store.state.route.params.loggedOutMessage
		}
	},
	mounted() {
		// const response = (await AdminService.getUserLoginList()).data
		// console.log(response)
		// if (response.users) {
		// 	this.noUsers = null
		// 	let userList = this.userList
		// 	response.users.forEach(function(user) {
		// 		userList.push(user)
		// 	})
		// }
		// // If there are no Users in the DB
		// if (response.noUsers) {
		// 	this.noUsers = response.noUsers
		// }
		// // TODO: Fire this only if user logged out
		// if (this.loggedOutMessage !== null && this.loggedOutMessage !== {}) {
		// 	this.success = this.loggedOutMessage
		// 	await setTimeout(() => {
		// 		this.success = null
		// 	}, 3000)
		// 	this.loggedOutMessage = null
		// }
	},
	methods: {
		handleSelectedUser(selectedUser) {
			this.username = selectedUser.username
			this.password = ''
			this.$refs.inputPassword.focus()
		},

		async loginUser() {
			try {
				const response = (await AuthenticationService.loginUser({
					username: this.username,
					password: this.password
				})).data
				// Navigate to user home page
				if (response.user) {
					this.$router.push({
						name: 'user-home'
					})
					// Set user in the vuex store
					this.$store.dispatch('setUser', response.user)
				}

				// console.log('Login successfull: ', response.user.username)
			} catch (error) {
				console.log(error)
				this.success = null
				this.error = error.response.data.error
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

	.userList {
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

		.singleUserLi {
			cursor: pointer;
			list-style: none;
			text-align: left;
			font-size: 18px;
			margin: 10px 0 0 0;
			&:hover {
				.singleUserDiv {
					background-color: lighten(green, 40);
					border-left: 2px solid green;
				}
			}

			.singleUserDiv {
				min-height: 50px;
				background-color: lighten(green, 55);
				padding: 10px;
				border-radius: 10px;
				display: table;
			}
		}

		.userListEmptyText {
			text-align: center;
			font-size: 20px;
		}
	}

</style>
