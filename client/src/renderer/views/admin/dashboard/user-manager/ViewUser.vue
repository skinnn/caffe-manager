<template>
	<div class="view-user-page">
		<h1 class="heading">
			{{ user.name }}
			
			<button
				:class="[options.userEditMode ? 'btn-delete' : 'btn-edit']"
				@click="toggleUserEditMode()"
				ref="editUserBtn"
			>
				{{ options.userEditMode ? 'Discard' : 'Edit' }}
			</button>
		</h1>

		<div class="form-group">
			<label for="username">Username</label>
			<input id="username" type="text" class="form-control" 
				:readonly="!options.userEditMode"
				v-model="form.fields.username"
			>
		</div>
		<div class="form-group">
			<label for="username">Full name</label>
			<input id="name" type="text" class="form-control" 
				:readonly="!options.userEditMode"
				v-model="form.fields.name"
			>
		</div>
		<div class="form-group">
			<label for="email">Email</label>
			<input id="email" type="email" class="form-control" 
				:readonly="!options.userEditMode"
				v-model="form.fields.email"
			>
		</div>
		<div class="form-group">
			<label for="phone">Phone</label>
			<input id="phone" type="text" class="form-control" 
				:readonly="!options.userEditMode"
				v-model="form.fields.phone"
			>
		</div>
		<div class="form-group">
			<label for="address">Address</label>
			<input id="address" type="text" class="form-control" 
				:readonly="!options.userEditMode"
				v-model="form.fields.address"
			>
		</div>
		<div class="form-group">
			<label for="note">Note</label>
			<textarea id="note" type="text" class="form-control" 
				:readonly="!options.userEditMode"
				v-model="form.fields.note"
			></textarea>
		</div>

		<div class="form-group">
			<label for="permissions">Permissions</label>
			<select class="form-control"
				:disabled="!options.userEditMode"
				@change="handleSelectRole()"
				:readonly="!options.userEditMode"
			>
				<option value="user">user</option>
				<option value="admin">admin</option>
			</select>
		</div>

		<div class="form-group">
			<button type="button" class="btn-submit btn-update-user"
				v-if="options.userEditMode"
				@click="onSubmitUpdateUser()"
			>
				Save changes
			</button>
		</div>

		<div class="form-group">
			<button type="button"
				:class="[options.passwordEditMode ? 'btn-delete' : 'btn-edit', 'btn-edit-password']"
				v-if="!options.userEditMode"
				@click="togglePasswordEditMode()"
			>
				{{ options.passwordEditMode ? 'Discard password change' : 'Change password'  }}
			</button>
		</div>

		<!-- Password form -->
		<div class="password-form-wrapper"
			ref="passwordFormWrapper"
		>
			<form class="form-row"
				v-if="options.passwordEditMode"
				@submit="onSubmitUpdatePassword()"
				ref="changePasswordForm"
			>
				<div class="col">
					<label for="password">New Password</label>
					<input 
						id="password"
						type="password" 
						class="form-control" 
						v-model="form.passwordFields.password"
					>
				</div>
				<div class="col">
					<label for="password2">Confirm Password</label>
					<input 
						id="password2"
						type="password" 
						class="form-control" 
						v-model="form.passwordFields.password2"
					>
					</div>	
				
				<div class="col">
					<button 
						type="submit" 
						class="btn-submit"
					>
						Change
					</button>
				</div>
			</form>
		</div>

		<div class="user-related-info">
			<!-- TODO: Should list all Tables managed by this user (create component) -->
			<!-- TODO: Should list all current opened Orders from this user (create component) -->
		</div>
	</div>
</template>

<script>
// Services
import UserService from '@/services/UserService'
import { isEmptyObject } from '@/lib/helpers'

export default {
	
	data() {
		return {
			user: {},
			options: {
				userEditMode: false,
				passwordEditMode: false
			},
			form: {
				fields: {
					username: '',
					name: '',
					email: '',
					phone: '',
					address: '',
					note: '',
					roles: []
				},
				meta: {
					created: '',
					created_by: '',
					updated: '',
					updated_by: ''
				},
				passwordFields: {
					password: '',
					password2: ''
				}
			}
		}
	},

	mounted() {
		this.getUserById()		
	},

	methods: {
		async getUserById() {
			try {
				// const userId = this.$store.state.route.params.userId
				const userId = this.$route.params.userId
				const res = await UserService.getUserById(userId)
				const user = res.data.user

				// Save original user data
				this.user = user

				// Populate user data fields in the form
				this.populateFormData(this.form.fields, user)
				// Populate user meta fields
				this.populateFormData(this.form.meta, user)
				console.log(this.form)
			} catch (err) {
				console.log(err)
				this.$store.dispatch('addNotification', {
					type: 'error',
					text: err.response.data.message
				})
			}
		},

		async onSubmitUpdateUser() {
			try {
				// Get all fields which are changed (need to be updated)
				const changedFields = this.checkForChangedFields(this.form.fields, this.user)
				
				if (!isEmptyObject(changedFields)) {
					const userId = this.user.id
					const res = await UserService.updateUserById(userId, changedFields)
					const updatedUser = res.data.user
					
					// Set user data to the updated user
					this.user = updatedUser

					if (res.status === 200) {
						this.$store.dispatch('addNotification', {
							type: 'success',
							text: 'User updated successfully'
						})
					}
				} else {
					this.$store.dispatch('addNotification', {
						type: 'warning',
						text: 'Nothing to update'
					})
				}
			} catch (err) {
				console.log(err)
			}
		},

		async onSubmitUpdatePassword() {
			event.preventDefault()
			try {
				const userId = this.user.id
				const res = await UserService.updateUserById(userId, this.form.passwordFields)
				const user = res.data.user

				this.togglePasswordEditMode()
				this.resetPasswordFields()

				this.$store.dispatch('addNotification', {
					type: 'success',
					text: `Password for user ${user.username} has been updated`
				})
			} catch (err) {
				this.$store.dispatch('addNotification', {
					type: 'error',
					text: err.response.data.message
				})
				console.error(err)
			}
		},

		/**
		 * Returns object with props which keys are changed comparing to the origina fields.
		 * @param objToCheck
		 * @param originalObject
		 */
		checkForChangedFields(objToCheck, originalObject) {
			let changedFields = {}
			for (let field in objToCheck) {
				for (let originalField in originalObject) {
					if (field === originalField) {
						
						if (objToCheck[field] !== originalObject[originalField]) {
							changedFields[field] = objToCheck[field]
						}
					}
				}
			}
			return changedFields
		},

		toggleUserEditMode() {
			this.options.userEditMode = !this.options.userEditMode

			// Reset user form fields when discarded
			if (this.options.userEditMode === false) {
				this.discardUserEditing()
			}
		},

		togglePasswordEditMode() {
			this.options.passwordEditMode = !this.options.passwordEditMode
			
			if (this.options.passwordEditMode === true) {
				this.$refs.editUserBtn.setAttribute('disabled', true)
			} else {
				this.$refs.editUserBtn.removeAttribute('disabled')
				this.resetPasswordFields()
			}
		},

		handleSelectRole() {
			const role = event.target.value
			this.form.fields.roles = [role]
		},

		discardUserEditing() {
			this.populateFormData(this.form.fields, this.user)
			// this.clearPasswordFields()
		},

		resetPasswordFields() {
			// Reser password fields
			this.form.passwordFields.password = ''
			this.form.passwordFields.password2 = ''
		},

		populateFormData(fields, userRecord) {
			for (let field in fields) {
				for (let prop in userRecord) {
					if (field === prop) {
						fields[field] = userRecord[prop]

						// // Format dateOfBirth while populating the form
						// if (key === 'dateOfBirth') {
						// 	// Format user dateOfBirth from datetime to date
						// 	userRecord[key] = userRecord[key].split('T')[0]
						// }
					}
				}
			}
		}
	}
}
</script>

<style scoped lang="scss">

	.view-user-page {
		padding-bottom: 50px;
		
		.btn-edit-password {
			
		}
	}

	.user-info {
		width: 100%;
	}

</style>
