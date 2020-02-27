<template>
	<v-flex xs4>
		<div class="elevation-5">
			<ul class="loginList">
				<h3 v-if="noUsers" class="loginListEmptyText">
					No users found
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
			noUsers: false,
			// Messages
			error: null,
			success: null,
			info: null
		}
	},

	mounted() {
		if (this.$props.userType === 'admins') {
			this.getAdminLoginList()
		} else if (this.$props.userType === 'users') {
			this.getUserLoginList()
		}
	},

	methods: {
		async getAdminLoginList() {
			try {
				const response = (await UserService.getAdminLoginList()).data

				if (response.admins) {
					if (response.admins.length === 0) this.noUsers = true
					this.loginList = response.admins
				}
			} catch (err) {
				console.error(err)
			}
		},

		async getUserLoginList() {
			try {
				const response = (await UserService.getUserLoginList()).data

				if (response.users) {
					if (response.users.length === 0) this.noUsers = true
					this.loginList = response.users
				}
			} catch (err) {
				console.error(err)
			}
		},

		selectUser(user) {
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
