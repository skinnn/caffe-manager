<template>
	<!-- <v-layout row class="mt-5">
		<v-flex xs5 offset-xs3>
			<div class="white elevation-5">
				<v-toolbar class="black toolbar" flat dense>
					<v-toolbar-title class="toolbar-title">Login</v-toolbar-title>
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
		</v-flex> -->
		<v-flex xs4>
			<div class="elevation-5">
				<ul class="loginList">
					<h3 v-if="loginList.length === 0" class="loginListEmptyText">
						No admins
					</h3>
					<li
						v-for="user in loginList"
						:key="user.username"
						@click="selectUser(user)"
						class="singleAdminLi"
					>
						<div class="singleAdminDiv">{{user.name}}</div>
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
import UserService from '@/services/UserService'

export default {

	props: {
		userType: {
			type: String,
			default: ''
		}
	},

	data() {
		return {
			loginList: [],
			// Messages
			error: null,
			success: null,
			info: null
		}
	},

	computed: {
		getUserType() {
			return this.$props.userType
		}
	},

	mounted() {
		// this.$refs.inputUsername.focus()

		if (this.getUserType === 'admins') {
			this.getAdminLoginList()
		} else if (this.getUserType === 'users') {
			this.getUserLoginList()
		}
	},

	methods: {
		async getAdminLoginList() {
			try {
				const response = (await UserService.getAdminLoginList()).data

				if (response.admins) {
					// this.loginList = []
					response.admins.forEach((admin) => {
						this.loginList.push(admin)
					})
				}
			} catch (err) {
				console.error(err)
			}
		},

		async getUserLoginList() {
			try {
				const response = (await UserService.getUserLoginList()).data

				if (response.users) {
					// this.loginList = []
					response.users.forEach((user) => {
						this.loginList.push(user)
					})
				}
			} catch (err) {
				console.error(err)
			}
		},

		selectUser(user) {
			console.log(user)
			// this.username = username
			// this.password = ''
			// this.$refs.inputPassword.focus()

			this.$emit('userSelected', user)
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

	.loginList {
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

		.loginListEmptyText {
			text-align: center;
			font-size: 20px;
		}
	}

</style>
