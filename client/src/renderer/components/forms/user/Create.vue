<template>
	<div class="create-user-wrapper">

		<!-- Create user form -->
		<form class="create-user-form">
			<div class="form-group">
				<div class="form-group">
					<label for="username">Username <span class="required-field">*</span></label>
					<input id="username" type="text" class="form-control" 
						v-model="form.fields.username"
					>
				</div>
				<div class="form-group">
					<div
						class="passwordStrengthMessage"
						v-if="showPasswordStrength"
						v-bind:class="{
							strong : passwordStrength === 'strong',
							weak : passwordStrength === 'weak',
							medium: passwordStrength === 'medium'
						}"
					>
						<p class="pwMessageText">{{passwordStrengthText}}</p>
					</div>
					<label for="password">Password <span class="required-field">*</span></label>
					<input type="password" id="password" class="form-control"
						v-model="form.fields.password"
						@input="analyzePasswordStrength(form.fields.password), isPasswordConfirmed(form.fields.password2)"
					>
				</div>

				<div class="form-group">
					<div
						class="confirmPasswordMessage"
						v-if="showPasswordStrength"
						v-bind:class="{
							passwordMatched : confirmPasswordMatched === true,
							passwordWrong : confirmPasswordMatched === false
						}"
					>
						<p class="pwMessageText">{{isPasswordConfirmedText}}</p>
					</div>
					<label for="password2">Confirm password <span class="required-field">*</span></label>
					<input
						type="password"
						id="password2"
						class="form-control"
						v-model="form.fields.password2"
						@input="isPasswordConfirmed(form.fields.password2)"
					>
				</div>

				<div class="form-group">
					<label for="username">Full name <span class="required-field">*</span></label>
					<input type="text" id="username" class="form-control"
						v-model="form.fields.name"
					>
				</div>

				<div class="form-group">
					<label for="permissions">Permissions <span class="required-field">*</span></label>
					<select class="form-control"
						@change="handleSelectRole()"
					>
						<option
							v-for="opt in form.select.roles"
							:key="opt.value"
							:selected="opt.value === form.fields.roles[0]"
						>
							{{ opt.text }}
						</option>
					</select>
				</div>
				
				<div class="form-group">
					<label for="email">Email</label>
					<input id="email" type="email" class="form-control" 
						v-model="form.fields.email"
					>
				</div>
				<div class="form-group">
					<label for="phone">Phone</label>
					<input id="phone" type="text" class="form-control" 
						v-model="form.fields.phone"
					>
				</div>
				<div class="form-group">
					<label for="address">Address</label>
					<input id="address" type="text" class="form-control" 
						v-model="form.fields.address"
					>
				</div>
				<div class="form-group">
					<label for="note">Note</label>
					<textarea id="note" type="text" class="form-control" 
						v-model="form.fields.note"
					></textarea>
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
					<img class="previewImg" :src="form.files.profileImage.src" alt="Profile image">
				</div>
			</div>

			<button type="button" class="btn-submit"
				@click="createUser()"
			>
				Create
			</button>
		</form>
	</div>
</template>

<script>
// Services
import UserService from '@/services/UserService'
// Helpers
import { isEmptyObject } from '@/lib/helpers'

export default {
	name: 'CreateUserForm',

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
				mode: null,

				fields: {
					username: 'jdoe1',
					password: '123123',
					password2: '123123',
					name: 'John Doe',
					email: 'jdoe@test.com',
					phone: '+1 123123 1231',
					address: 'Some st. 123',
					note: 'Sort user note..',
					roles: ['user']
				},
				files: {
					profileImage: {
						src: null,
						file: null
					}
				},
				select: {
					roles: [
						{ text: 'user', value: 'user' },
						{ text: 'admin', value: 'admin' }
					]
				},
				// Data not to be manipulated/updated
				meta: {
					files: [],
					created: '',
					created_by: '',
					updated: '',
					updated_by: ''
				}
			},

			showPasswordStrength: false,
			// Password strength
			passwordStrength: 'weak',
			passwordStrengthText: '',
			// Is password confirmed
			confirmPasswordMatched: false,
			isPasswordConfirmedText: '',
			// TODO: Centralize regexes/form policies, constants, create helpers
			// Password regexes ( password strength )
			strongRegex: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'),
			mediumRegex: new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})')
		}
	},

	mounted() {
		console.log(this.form.fields)
	},

	methods: {

		async getUserById(id) {
			try {
				// const userId = this.$store.state.route.params.userId
				// const id = this.$route.params.userId
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
	
		async createUser() {
			event.preventDefault()
			try {
				// Send the request
				const response = await UserService.createUser(this.form.fields)
				const user = response.data.user

				// Created successfully
				if (response.status === 201) {
					const profileImage = this.form.files.profileImage.file
					if (profileImage) {
						const attachmentResponse = await this.createUserAttachment(user.id, profileImage)
					}
					
					this.resetFormFields()

					this.$store.dispatch('addNotification', {
						type: 'success',
						text: `User with username <span style="color: blue; font-size:17px;">${user.username}</span> has been created.`
					})
				}
			} catch (error) {
				console.log(error.response.data)

				this.$store.dispatch('addNotification', {
					type: 'error',
					text: error.response.data.message
				})
			}
		},

		async createUserAttachment(userId, profileImage) {
			try {
				const formData = new FormData()
				const identifier = 'profile_image'
				formData.append('attachment', profileImage)
				// Upload image
				const fileResponse = await UserService.uploadUserAttachment(userId, identifier, formData)
				return fileResponse
			} catch (err) {
				console.error(err)
			}
		},

		analyzePasswordStrength(password) {
			if (this.strongRegex.test(password)) {
				this.passwordStrength = 'strong'
				this.passwordStrengthText = 'Strong password'
				this.showPasswordStrength = true
			} else if (this.mediumRegex.test(password)) {
				this.passwordStrength = 'medium'
				this.passwordStrengthText = 'Medium strength'
				this.showPasswordStrength = true
			} else if (password === '') {
				this.passwordStrength = 'weak'
				this.passwordStrengthText = ''
				this.showPasswordStrength = false
			} else {
				this.passwordStrength = 'weak'
				this.passwordStrengthText = 'Weak password'
				this.showPasswordStrength = true
			}
		},

		handleSelectRole() {
			const role = event.target.value
			this.form.fields.roles = [role]

			console.log(this.form.fields)
		},

		isPasswordConfirmed(password) {
			if (password === '') {
				this.confirmPasswordMatched = null
				this.isPasswordConfirmedText = ''
			} else if (password === this.form.fields.password) {
				this.confirmPasswordMatched = true
				this.isPasswordConfirmedText = 'Passwords match'
			} else {
				this.confirmPasswordMatched = false
				this.isPasswordConfirmedText = 'Passwords don\'t match'
			}
		},

		imagePreview() {
			const file = event.target.files[0]
			// Set selected image
			this.form.files.profileImage.file = file
			// Preview selected image
			const previewImg = this.form.files.profileImage
			var reader = new FileReader()
			reader.onload = function(e) {
				previewImg.src = e.target.result
			}
			reader.readAsDataURL(file)
		},

		resetFormFields() {
			this.form.fields.username = ''
			this.form.fields.password = ''
			this.form.fields.password2 = ''
			this.form.fields.email = ''
			this.form.fields.name = ''
			this.form.fields.phone = ''
			this.form.fields.address = ''
			this.form.fields.note = ''
			this.form.fields.roles = []
			this.form.files.profileImage.file = null
			this.form.files.profileImage.src = ''
			// Hide password messages
			this.showPasswordStrength = false
			this.confirmPasswordMatched = null

			this.$refs.profileImageRef.value = ''
		}
	}
}
</script>

<style scoped lang="scss">

	form.create-user-form {
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

		button.create-user-btn {
			@extend .btn-submit
		}
	}

</style>
