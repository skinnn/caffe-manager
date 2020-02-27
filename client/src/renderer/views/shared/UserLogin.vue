<template>
	<v-layout row class="mt-5">

		<LoginForm :heading="'User Login'" :selectedUser="selectedUser" />
		<LoginList :userType="'users'" @userSelected="handleSelectedUser" />
		
	</v-layout>
</template>

<script>
// Components
import LoginForm from '@/components/shared/forms/Login'
import LoginList from '@/components/shared/lists/LoginList'

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

<style scoped lang="scss">

	.toolbar-title {
		color: white;
	}

	.msg-placeholder {
		height: 36px;
	}

</style>
