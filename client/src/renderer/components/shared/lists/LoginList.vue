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

	// TODO: Create/add circular loader
	methods: {
		async getUserLoginList() {
			try {
				const res = await UserService.getLoginList({ role: 'user' })
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
	$blue-color: rgb(1, 39, 193);

	.login-list {
		display: block;
		position: relative;
		left: 4%;
		height: 415px;
		min-width: 350px;
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

				// display: table;
				// margin: 10px 0 0 0;
				// padding: 10px 6px;
				// height: 40px;
				// border-radius: 5px;
				// background-color: #333;

				&:hover {
					span.user-name {
						// background-color: #333;
					}
				}

				span.user-name {
					display: inline-block;
					padding: 10px 6px;
					height: 40px;
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
