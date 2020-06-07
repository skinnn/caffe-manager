<template>
	<div class="login-page">
		<LoginForm :heading="'Login'" :selectedUser="selectedUser" />
		<LoginList :userType="'user'" @userSelected="handleSelectedUser" />
	</div>
</template>

<script>
// Components
import LoginList from '@/components/shared/lists/LoginList'
import LoginForm from '@/components/shared/forms/Login'

export default {
	components: { LoginForm, LoginList },

	data() {
		return {
			selectedUser: {}
		}
	},

	methods: {
		handleSelectedUser(selectedUser) {
			this.selectedUser = selectedUser
		}
	}
}
</script>

<style lang="scss">
	.login-page {
		width: 100%;
		height: 100%;
		
		.login-box {
			margin-top: 6%;
		}
	}
</style>
