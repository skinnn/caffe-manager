<template>
	<div class="admin-view">
		<v-layout column class="right-side">
			<!-- <v-flex>
				<div class="admin-header">
						<h1 class="heading">
							User: {{user.name}}
							<v-btn @click="editUser(user._id)" class="yellow">
								Edit
							</v-btn>
						</h1>
						<LogoutBtn />
				</div>
			</v-flex> -->

			<v-flex class="admin-container">
				<!-- Display messages -->
				<div class="error-msg" v-if="error" v-html="error" />
				<div class="success-msg" v-if="success" v-html="success" />

				<div class="user-info">
					<p>Username: {{user.username}}</p>
					<p>ID: {{user._id}}</p>
					<p>Full name: {{user.name}}</p>

					<!-- TODO: Should list all the Tables from this user -->
					<!-- TODO: Should list all current opened Orders from this user -->

				</div>

			</v-flex>
		</v-layout>
	</div>
</template>

<script>
// Services
import UserService from '@/services/UserService'

export default {
	components: {
		// AdminSideMenu
	},
	data() {
		return {
			user: {},
			error: null,
			success: null
		}
	},
	async mounted() {
		try {
			// const userId = this.$store.state.route.params.userId
			const userId = this.$route.params.userId
			console.log('USERID: ', userId)
			const response = (await UserService.getUserById(userId)).data

			if (response.user) {
				this.user = response.user
			}
		} catch (error) {
			this.success = null
			this.error = error.response.data.error
		}
	},
	methods: {
		editUser(userId) {
			this.$router.push({name: 'admin-edit-user', params: {userId}})
		}
	}
}
</script>

<style scoped lang="scss">

	.user-info {
		width: 100%;
	}

	.list-title {
		font-size: 17px;
	}

</style>
