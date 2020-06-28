<template>
	<div class="admin-create-user-page">

		<CreateUserForm />
	</div>
</template>

<script>
// Components
import CreateUserForm from '@/components/forms/user/Create'
// Services
import UserService from '@/services/UserService'
import { mapGetters } from 'vuex'

export default {
	components: { CreateUserForm }
}
</script>

<style scoped lang="scss">
	// .admin-create-user-page {}
</style>
