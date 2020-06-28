<template>
	<div class="update-user-wrapper">
		<div class="row">
			<!-- Left -->
			<div class="col left">
				<div class="form-group">
					<label for="username">Username</label>
					<input id="username" type="text" class="form-control" 
						:readonly="!editMode"
						v-model="form.fields.username"
					>
				</div>
				<div class="form-group">
					<label for="username">Full name</label>
					<input id="name" type="text" class="form-control" 
						:readonly="!editMode"
						v-model="form.fields.name"
					>
				</div>
				<div class="form-group">
					<label for="email">Email</label>
					<input id="email" type="email" class="form-control" 
						:readonly="!editMode"
						v-model="form.fields.email"
					>
				</div>
				<div class="form-group">
					<label for="salary">Salary (monthly)</label>
					<input id="salary" type="number" class="form-control" 
						:readonly="!editMode"
						v-model="form.fields.salary"
					>
				</div>
				<div class="form-group">
					<label for="phone">Phone</label>
					<input id="phone" type="text" class="form-control" 
						:readonly="!editMode"
						v-model="form.fields.phone"
					>
				</div>
				<div class="form-group">
					<label for="address">Address</label>
					<input id="address" type="text" class="form-control" 
						:readonly="!editMode"
						v-model="form.fields.address"
					>
				</div>
				<div class="form-group">
					<label for="note">Note</label>
					<textarea id="note" type="text" class="form-control" 
						:readonly="!editMode"
						v-model="form.fields.note"
					></textarea>
				</div>

				<div class="form-group">
					<label for="permissions">Permissions</label>
					<select class="form-control"
						v-if="user && user.roles"
						@change="handleSelectRole()"
						:disabled="!editMode"
						:readonly="!editMode"
					>
						<option
							v-for="opt in form.select.roles"
							:key="opt.value"
							:value="opt.value"
							:selected="opt.value == user.roles[0]"
						>
							{{ opt.text }}
						</option>
					</select>
				</div>

				<p>Created by: 
					<span class="clickable" style="color: blue;"
						@click="viewUser(form.meta.created_by.id)"
					>
						{{ form.meta.created_by.username }}
					</span>
				</p>
				<p>Created: {{ _formatDate(form.meta.created) }}</p>
				<p>
					Last update:
					{{ form.meta.updated ? _formatDate(form.meta.updated) : '' }}

					<span v-if="form.meta.updated_by && form.meta.updated_by.username">
						by
						<span class="clickable" style="color: blue;"
							@click="viewUser(form.meta.created_by.id)"
						>
							{{ form.meta.updated_by.username ? form.meta.updated_by.username : ''}}
						</span>
					</span>
					<span v-else>Never</span>
				</p>

				<!-- Password form -->
				<div class="form-group">
					<button type="button"
						:class="[form.passwordEditMode ? 'btn-delete' : 'btn-info', 'btn-info-password']"
						v-if="!editMode"
						@click="togglePasswordEditMode()"
					>
						{{ form.passwordEditMode ? 'Discard password change' : 'Change password'  }}
					</button>
				</div>

				<div class="password-form-wrapper"
					ref="passwordFormWrapper"
				>
					<form class="form-row"
						v-if="form.passwordEditMode"
						@submit="updatePassword()"
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
								Update password
							</button>
						</div>
					</form>
				</div>

				<button type="button" class="btn-submit"
					v-if="editMode && !form.passwordEditMode"
					@click="updateUser()"
				>
					Update
				</button>
			</div>

			<!-- Right -->
			<div class="col right">
				<div class="form-group">
					<ImgPlaceholder
						:isLoading="form.file.profileImage.isLoading"
						:src="form.file.profileImage.src"
						:fallbackSrc="'img/placeholders/user_profile_image.jpg'"
					/>
				</div>
				<div class="form-group">
					<label for="profile-image">Profile image</label>
					<input
						type="file"
						@change="imagePreview()"
						ref="profileImageRef"
						id="profile-image"
						class="form-control-file"
					>
					<button type="button"
						:class="['btn-info']"
						@click="updateAttachment()"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// Components
import ImgPlaceholder from '@/components/base/img/ImgPlaceholder'
// Services
import UserService from '@/services/UserService'
// Helpers
import { isEmptyObject } from '@/lib/helpers'

export default {
	name: 'UpdateUserForm',
	components: { ImgPlaceholder },

	props: {
		editMode: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			user: {},
			form: {
				passwordEditMode: false,

				fields: {
					username: '',
					name: '',
					email: '',
					phone: '',
					address: '',
					note: '',
					salary: null,
					roles: []
				},
				passwordFields: {
					password: '',
					password2: ''
				},
				file: {
					profileImage: {
						isLoading: false,
						src: '',
						file: null
					}
				},
				select: {
					roles: [ { text: 'user', value: 'user' }, { text: 'admin', value: 'admin' } ]
				},
				// Data not to be manipulated/updated
				meta: {
					files: [],
					created: '',
					created_by: '',
					updated: '',
					updated_by: ''
				}
			}
		}
	},

	watch: {
		editMode: function(val) {
			if (val === false) this.discardForm()
		},
		user: function(val) {
			this.populateFormData(this.form.fields, val)
			this.populateFormData(this.form.meta, val)
		}
	},

	async mounted() {
		try {
			const id = this.$route.params.userId
			const user = await this.getUserById(id)
			this.user = user

			this.getUserAttachment()

			// this.populateFormData(this.form.fields, this.user)
			// this.populateFormData(this.form.meta, this.user)
		} catch (err) {
			console.error(err)
		}
	},

	methods: {

		async getUserById(id) {
			try {
				// const userId = this.$store.state.route.params.userId
				// const id = this.$route.params.userId
				const query = '?include=created_by,updated_by,files'

				const res = await UserService.getUserById(id, query)
				const user = res.data.user

				return user
			} catch (err) {
				console.error(err)
				this.$store.dispatch('addNotification', {
					type: 'error',
					text: err.response.data.message
				})
			}
		},
	
		async updateUser() {
			try {
				// Get all fields which are changed (need to be updated)
				const changedFields = this.checkForChangedFields(this.form.fields, this.user)
				changedFields.salary ? changedFields.salary = parseInt(changedFields.salary, 10) : null

				if (!isEmptyObject(changedFields)) {
					const id = this.user.id
					const query = '?include=created_by,updated_by,files'

					const res = await UserService.updateUserById(id, changedFields, query)
					const updatedUser = res.data.user
					this.user = updatedUser

					// Emit update user event
					this.$emit('userUpdate', this.user)

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
				console.error(err)
			}
		},

		async updatePassword() {
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

		async updateAttachment() {
			if (!this.form.file.profileImage.file) {
				return this.$store.dispatch('addNotification', {
					type: 'info',
					text: 'Image not changed'
				})
			}
			try {
				const formData = new FormData()
				formData.append('attachment', this.form.file.profileImage.file)
				const res = await UserService.updateAttachmentByUserId(this.user.id, 'profile_image', formData)
				this.$store.dispatch('addNotification', {
					type: 'success',
					text: 'Image updated successfully'
				})
			} catch (err) {
				console.error(err)
			}
		},

		togglePasswordEditMode() {
			this.form.passwordEditMode = !this.form.passwordEditMode
			
			if (this.form.passwordEditMode === true) {
				this.$emit('passwordEditModeChange', this.form.passwordEditMode)
			} else {
				this.$emit('passwordEditModeChange', this.form.passwordEditMode)
				this.resetPasswordFields()
			}
		},

		async getUserAttachment() {
			try {
				this.form.file.profileImage.isLoading = true
				const res = await UserService.getUserAttachment(this.user.id, 'profile_image')
				if (res.status == 200) {
					const blob = res.data || null
					this.form.file.profileImage.src = URL.createObjectURL(blob)
					this.form.file.profileImage.isLoading = false
				}
			} catch (err) {
				this.form.file.profileImage.isLoading = false
				console.error(err)
				throw err
			}
		},

		// isPasswordConfirmed(password) {
		// 	if (password === '') {
		// 		this.confirmPasswordMatched = null
		// 		this.isPasswordConfirmedText = ''
		// 	} else if (password === this.form.fields.password) {
		// 		this.confirmPasswordMatched = true
		// 		this.isPasswordConfirmedText = 'Passwords match'
		// 	} else {
		// 		this.confirmPasswordMatched = false
		// 		this.isPasswordConfirmedText = 'Passwords don\'t match'
		// 	}
		// },

		// analyzePasswordStrength(password) {
		// 	if (this.strongRegex.test(password)) {
		// 		this.passwordStrength = 'strong'
		// 		this.passwordStrengthText = 'Strong password'
		// 		this.showPasswordStrength = true
		// 	} else if (this.mediumRegex.test(password)) {
		// 		this.passwordStrength = 'medium'
		// 		this.passwordStrengthText = 'Medium strength'
		// 		this.showPasswordStrength = true
		// 	} else if (password === '') {
		// 		this.passwordStrength = 'weak'
		// 		this.passwordStrengthText = ''
		// 		this.showPasswordStrength = false
		// 	} else {
		// 		this.passwordStrength = 'weak'
		// 		this.passwordStrengthText = 'Weak password'
		// 		this.showPasswordStrength = true
		// 	}
		// },

		handleSelectRole() {
			const role = event.target.value
			this.form.fields.roles = [role]
		},

		imagePreview() {
			const file = event.target.files[0]
			// Set selected image
			this.form.file.profileImage.file = file
			// Preview selected image
			const profileImg = this.form.file.profileImage
			var reader = new FileReader()
			reader.onload = function(e) {
				profileImg.src = e.target.result
			}
			reader.readAsDataURL(file)
		},

		discardForm() {
			this.populateFormData(this.form.fields, this.user)
		},

		resetPasswordFields() {
			// Reser password fields
			this.form.passwordFields.password = ''
			this.form.passwordFields.password2 = ''
		},

		viewUser(id) {
			this.$router.push({ name: 'admin-view-user', params: { userId: id } })
		},

		// TODO: Move to form helpers file
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
		},

		// TODO: Move to form helpers file
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
		}
	}
}
</script>

<style scoped lang="scss">

	form.update-user-form {
		width: 600px;
		max-width: 600px;
		padding: 20px;

		h3 {
			height: 40px;
			display: inline-block;
			width: 370px;
		}

		.required-field {
			color: red;
		}

		.passwordStrengthMessage {
			float: right;
			width: 170px;
			height: 30px;
			text-align: center;
			font-size: 13px;
			border-radius: 15px;

			.pwMessageText {
				display: table;
				margin: 6px auto;
				text-align: center;
				font-weight: 400;
			}
		}
		.strong {
			background-color: $success;
		}
		.medium {
			background-color: $warning;
		}
		.weak {
			background-color: $error;
		}

		.confirmPasswordMessage {
			float: right;
			width: 170px;
			height: 30px;
			text-align: center;
			font-size: 13px;
			border-radius: 15px;

			.pwMessageText {
				display: table;
				margin: 6px auto;
				text-align: center;
				position: relative;
				font-weight: 400;
			}
		}
		.passwordWrong {
			background-color: lighten(red, 30);
		}
		.passwordMatched {
			background-color: lighten(green, 45);
		}

		.previewImg {
			width: 130px;
			height: 130px;
			max-width: 130px;
			max-height: 130px;
			border: 1px solid orange;
			border-radius: 3px;
			margin: 10px 0 0 10px;
			display: block;
		}

		.previewImgInput {
			margin: 5px 0 0 10px;
		}
	}

</style>
