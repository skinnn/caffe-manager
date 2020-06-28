<template>
	<div class="login-list elevation-5">
		<ul ref="list">
			<p
				v-if="!loginList.length"
				class="list-empty"
			>
				No users found
			</p>
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
</template>

<script>
// Services
import UserService from '@/services/UserService'

export default {

	data() {
		return {
			loginList: [],
			noUsers: false
		}
	},

	mounted() {
		this.getUserLoginList()
	},

	methods: {
		async getUserLoginList() {
			try {
				const res = await UserService.getLoginList()
				const users = res.data.users

				if (res.status === 200) {
					this.loginList = users
				}
			} catch (err) {
				console.error(err)
			}
		},

		selectUser(user) {
			let els = this.$refs.list.getElementsByTagName('li')
			// Remove all other selections
			for (let i = 0; i < els.length; i++) {
				els[i].childNodes[0].classList.remove('selected-user')
			}
			event.target.classList.add('selected-user')
			this.$emit('userSelected', user)
		}
	}
}
</script>

<style scoped lang="scss">

	.login-list {
		display: block;
		position: fixed;
		top: 5%;
		right: 4%;
		height: 415px;
		min-width: 300px;
		max-width: 20%;
		padding: 10px 10px;
		overflow-y: auto;
		border: 1px solid grey;
		border-radius: 5px;
		background-color: lighten(grey, 40);

		ul {
			padding: 0 0;

			li.single-user {
				cursor: pointer;
				list-style: none;
				text-align: left;
				font-size: 14px;
				color: #fff;
				margin: 5px 0;

				&:hover {
					span.user-name {
						text-decoration: underline;
					}
				}

				span.user-name {
					display: inline-block;
					width: 100%;
					height: 40px;
					padding: 10px 10px;
					border-radius: 5px;
					background-color: #333;
				}

				.selected-user {
					border-left: 10px solid $blue-color;
				}
			}
		}

		.list-empty {
			text-align: center;
			font-size: 16px;
		}
	}

</style>
