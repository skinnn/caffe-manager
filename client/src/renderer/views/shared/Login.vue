<template>
	<v-layout row class="mt-5">

		<LoginForm :heading="'Login'" :selectedUser="selectedUser" />
		<LoginList :userType="'user'" @userSelected="handleSelectedUser" />
		
	</v-layout>
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

<style scoped lang="scss">

</style>
