<template>
	<v-flex xs4>
		<div class="elevation-5">
			<ul class="login-list">
				<h3 v-if="noUsers" class="login-list-empty">
					No users found
				</h3>
				<li
					v-for="user in loginList"
					:key="user.username"
					@click="selectUser(user)"
					class="single-user"
				>
					<span class="user-name">{{user.name}}</span>
				</li>
			</ul>
		</div>
	</v-flex>
</template>

<script>
// Services
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
			this.getLoginList('admin')
		} else if (this.$props.userType === 'users') {
			this.getLoginList('user')
		}
	},

	methods: {
		async getLoginList(role) {
			try {
				// role - 'admin' or 'user'
				const data = { role: role }
				const res = await UserService.getLoginList(data)
				const users = res.data.users

				if (res.status === 200) {
					if (users.length === 0) this.noUsers = true
					this.loginList = users
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

	.login-list {
		list-style: none;
		display: block;
		position: fixed;
		overflow-y: auto;
		height: 415px;
		min-width: 350px;
		padding: 0 10px 0 10px;
		left: 67%;
		border: 1px solid grey;
		border-radius: 5px;
		background-color: lighten(grey, 40);

		li.single-user {
			cursor: pointer;
			list-style: none;
			text-align: left;
			font-size: 14px;
			margin: 10px 0 0 0;

			&:hover {
				span.user-name {
					background-color: lighten(green, 40);
					// border-bottom: 2px solid green;
				}
			}

			span.user-name {
				display: inline-block;
				padding: 10px 6px;
				height: 40px;
				border-radius: 10px;
				background-color: lighten(green, 55);
			}
		}

		.login-list-empty {
			text-align: center;
			font-size: 20px;
		}
	}

</style>
