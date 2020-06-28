<template>
	<div class="view-user-page">
		<h1 class="heading">
			{{ user.name }}
			
			<button
				:class="[options.userEditMode ? 'btn-delete' : 'btn-info']"
				@click="toggleUserEditMode()"
				ref="editUserBtn"
			>
				{{ options.userEditMode ? 'Discard' : 'Edit' }}
			</button>
		</h1>

		<UpdateUserForm
			:key="componentKey"
			:editMode="options.userEditMode"
			@userUpdate="handleUserUpdate"
			@passwordEditModeChange="handlePasswordEditModeChange"
			/>

		<div class="user-related-info">
			<!-- TODO: Should list all Tables managed by this user (create component) -->
			<!-- TODO: Should list all current opened Orders from this user (create component) -->
		</div>
	</div>
</template>

<script>
// Components
import UpdateUserForm from '@/components/forms/user/Update'
// Services
import UserService from '@/services/UserService'
// Helpers
import { isEmptyObject } from '@/lib/helpers'

export default {
	components: { UpdateUserForm },
	
	data() {
		return {
			user: {},
			options: {
				userEditMode: false
			},

			componentKey: 1
		}
	},

	watch: {
		$route: function(newRoute, oldRoute) {
			this.forceComponentRerender()
		}
	},

	mounted() {
		this.getUserById()		
	},

	methods: {
		async getUserById() {
			try {
				// const userId = this.$store.state.route.params.userId
				const id = this.$route.params.userId
				const query = '?include=created_by,updated_by,files'

				const res = await UserService.getUserById(id, query)
				const user = res.data.user

				this.user = user
			} catch (err) {
				console.log(err)
				this.$store.dispatch('addNotification', {
					type: 'error',
					text: err.response.data.message
				})
			}
		},

		toggleUserEditMode() {
			this.options.userEditMode = !this.options.userEditMode
		},

		handleUserUpdate(user) {
			this.user = user
			this.options.userEditMode = false
		},

		handlePasswordEditModeChange(mode) {
			if (mode === true) {
				this.$refs.editUserBtn.setAttribute('disabled', true)
			} else {
				this.$refs.editUserBtn.removeAttribute('disabled')
			}
		},

		forceComponentRerender() {
			this.componentKey += 1
		}
	}
}
</script>

<style scoped lang="scss">

	.view-user-page {
		padding-bottom: 50px;
		
		// .btn-info-password {}
	}

	.user-info {
		width: 100%;
	}

</style>
