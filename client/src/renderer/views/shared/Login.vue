<template>
	<div class="login-page">
		<LoginForm :heading="'Login'" :selectedUser="selectedUser" />
		<LoginList :userType="'user'" @userSelected="handleSelectedUser" />
	</div>
</template>

<script>
// Components
import LoginList from '@/components/lists/LoginList'
import LoginForm from '@/components/forms/Login'

export default {
	components: { LoginForm, LoginList },

	data: function() {
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

<style scoped lang="scss">
	p {
		font-size: 2em;
		text-align: center;
	}
	.login-page {
		width: 100%;
		height: 100%;
		
		.login-box {
			margin-top: 6%;
		}
	}
</style>
