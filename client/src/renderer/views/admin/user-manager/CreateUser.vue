<template>
	<div class="admin-create-user">
		<div>
			<admin-side-menu />
		</div>
		<v-layout column class="right-side">
			<v-flex>
				<div class="admin-header">
						<h1 class="heading">
							Create Staff Member Account
						</h1>
						<admin-logout-btn />
				</div>
			</v-flex>

			<v-flex class="admin-container">
				<v-form
					@submit="onSubmit"
					enctype="multipart/form-data"
					class="register-user-form"
				>
					<h3 title="Required field">
						Username <span class="required-field">*</span>
					</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							title="Required field"
							:error-messages="username.error_message"
							maxlength="15"
							type="text"
							v-model="username.value"
							solo
						></v-text-field>
					</v-flex>

					<h3 title="Required field">
						Password <span class="required-field">*</span>
						<div
							class="passwordStrengthMessage"
							v-if="showMessage"
							v-bind:class="{
								strong : passwordStrength === 'strong',
								weak : passwordStrength === 'weak',
								medium: passwordStrength === 'medium'
							}"
						>
							<p class="pwMessageText">{{passwordStrengthText}}</p>
							</div>
					</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							@input="analyzePasswordStrength(password.value), isPasswordConfirmed(password2.value)"
							:success-messages="password.success_message"
							:error-messages="password.error_message"
							maxlength="32"
							type="password"
							v-model="password.value"
							solo
						></v-text-field>
					</v-flex>

					<h3 title="Required field">
						Confirm password <span class="required-field">*</span>
						<div
							class="confirmPasswordMessage"
							v-if="showMessage"
							v-bind:class="{
								passwordMatched : confirmPasswordMatched === true,
								passwordWrong : confirmPasswordMatched === false
							}"
						>
							<p class="pwMessageText">{{isPasswordConfirmedText}}</p>
							<!-- TODO: Add icons for match/fail <v-icon>check_box</v-icon> -->
						</div>
					</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							@input="isPasswordConfirmed(password2.value)"
							:success-messages="password2.success_message"
							:error-messages="password2.error_message"
							maxlength="32"
							type="password"
							v-model="password2.value"
							solo
						></v-text-field>
					</v-flex>

					<h3 title="Required field">
						Full name <span class="required-field">*</span>
					</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							:error-messages="name.error_message"
							maxlength="32"
							type="text"
							v-model="name.value"
							solo
						></v-text-field>
					</v-flex>

					<h3 title="Required field">
						Email
					</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							title="Required field"
							:error-messages="email.error_message"
							maxlength="30"
							type="text"
							v-model="email.value"
							solo
						></v-text-field>
					</v-flex>

					<h3>Phone</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							:error-messages="phone.error_message"
							maxlength="20"
							type="text"
							v-model="phone.value"
							solo
						></v-text-field>
					</v-flex>

					<h3>Address</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							:error-messages="address.error_message"
							maxlength="35"
							type="text"
							v-model="address.value"
							solo
						></v-text-field>
					</v-flex>

					<h3>Note:</h3>
					<v-flex xs12 sm8 d-flex>
						<v-textarea
							:error-messages="note.error_message"
							maxlength="250"
							type="text"
							v-model="note.value"
							placeholder="Write a short note about the person.."
							outline
						></v-textarea>
					</v-flex>

					<!-- TODO: Set it up and working -->
					<!-- <h3 class="mt-4">Permissions</h3>
					<v-checkbox
						:label="`Warehouse - ${userMenu.warehouse.toString()}`"
						v-model="userMenu.warehouse"
					></v-checkbox>
					<v-checkbox
						:label="`Tables - ${userMenu.tables.toString()}`"
						v-model="userMenu.tables"
					></v-checkbox> -->

					<h3>Add image</h3>
					<br>
					<div class="upload-image">
						<input
							type="file"
							@change="imagePreview()"
							name="imageUpload"
						>
						<img class="previewImg" :src="profileImage.src" alt="Profile image">
					</div>
					<br>

					<!-- Display messages -->
					<div class="error-msg" v-if="error" v-html="error" />
					<div class="success-msg" v-if="success" v-html="success" />
					<div class="info-msg" v-if="info" v-html="info" />

					<v-btn type="submit" class="yellow">
						Create
					</v-btn>
				</v-form>
			</v-flex>

		</v-layout>
	</div>
</template>

<script>
// Components
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import UserService from '@/services/UserService'
import { mapGetters } from 'vuex'

export default {

	components: {
		AdminSideMenu
	},

	computed: {
		...mapGetters(['getUserToken'])
	},

	data() {
		return {
			username: {
				value: '',
				error_message: ''
			},
			password: {
				value: '',
				success_message: '',
				error_message: ''
			},
			password2: {
				value: '',
				success_message: '',
				error_message: ''
			},
			name: {
				value: '',
				error_message: ''
			},
			email: {
				value: '',
				error_message: ''
			},
			phone: {
				value: '',
				error_message: ''
			},
			address: {
				value: '',
				error_message: ''
			},
			note: {
				value: '',
				error_message: ''
			},
			userMenu: {
				home: true, // Default is that all users have home page
				warehouse: false,
				tables: false
			},
			profileImage: {
				src: null,
				file: null
			},
			createdBy: this.$store.state.user._id,

			showMessage: false,
			// Password Strength - default
			passwordStrength: 'weak',
			passwordStrengthText: '',
			// Is Password Confirmed - default
			confirmPasswordMatched: false,
			isPasswordConfirmedText: '',
			// TODO: Centralize regexes/form policies, create helpers
			// Password Regexes ( Password Strength )
			strongRegex: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'),
			mediumRegex: new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'),
			// Messages
			info: null,
			error: null,
			success: null
		}
	},

	methods: {
		analyzePasswordStrength(password) {
			if (this.strongRegex.test(password)) {
				this.passwordStrength = 'strong'
				this.passwordStrengthText = 'Strong password'
				this.showMessage = true
			} else if (this.mediumRegex.test(password)) {
				this.passwordStrength = 'medium'
				this.passwordStrengthText = 'Medium strength'
				this.showMessage = true
			} else if (password === '') {
				this.passwordStrength = 'weak'
				this.passwordStrengthText = ''
				this.showMessage = false
			} else {
				this.passwordStrength = 'weak'
				this.passwordStrengthText = 'Weak password'
				this.showMessage = true
			}
		},

		isPasswordConfirmed(password) {
			if (password === '') {
				this.confirmPasswordMatched = null
				this.isPasswordConfirmedText = ''
			} else if (password === this.password.value) {
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
			this.profileImage.file = file
			// Preview selected image
			const previewImg = this.profileImage
			var reader = new FileReader()
			reader.onload = function(e) {
				previewImg.src = e.target.result
			}
			reader.readAsDataURL(file)
		},

		async onSubmit() {
			event.preventDefault()
			const token = await this.getUserToken
			try {
				const userFormData = new FormData()

				// Permisions - user menu
				// const userMenu = {
				// 	home: this.userMenu.home,
				// 	warehouse: this.userMenu.warehouse,
				// 	tables: this.userMenu.tables
				// }
				// Created By
				// Append everything to form data
				userFormData.append('roles[]', 'user')
				userFormData.append('profileImage', this.profileImage.file)
				userFormData.append('username', this.username.value)
				userFormData.append('name', this.name.value)
				userFormData.append('password', this.password.value)
				userFormData.append('email', this.email.value)
				// userFormData.append('userPassword2', password2)
				userFormData.append('phone', this.phone.value)
				userFormData.append('address', this.address.value)
				userFormData.append('note', this.note.value)
				// TODO: Finish
				// userFormData.append('permissions', userMenu)
				userFormData.append('createdBy', this.createdBy)

				// Register User
				const response = (await UserService.createUser(token, userFormData)).data

				// If registering was successful
				if (response.user) {
					// Set success message and timeout
					this.error = null
					this.info = null
					this.success = `User with username <span style="color: blue; font-size:17px;">${this.username.value}</span>
					 registered successfully.`
					setTimeout(() => {
						this.success = null
					}, 4000)

					// Set all Values to default after successful registering
					this.username.value = ''
					this.password.value = ''
					this.password2.value = ''
					this.email.value = ''
					this.name.value = ''
					this.phone.value = ''
					this.address.value = ''
					this.note.value = ''
					this.profileImage.file = null
					this.profileImage.src = ''
					// Hide password messages
					this.showMessage = false
					this.confirmPasswordMatched = null
				}
			} catch (error) {
				console.log(error.response)

				// Form Messages - Error/Success
				// Username
				if (error.response.data.username_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.username_error
					this.username.error_message = error.response.data.username_error
				} else {
					this.username.error_message = ''
				}
				// Password
				if (error.response.data.password_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.password_error
					this.password.error_message = error.response.data.password_error
				} else {
					this.password.error_message = ''
				}
				// Confirm Password
				if (error.response.data.password2_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.password2_error
					this.password2.error_message = error.response.data.password2_error
				} else {
					this.password2.error_message = ''
				}
				// Full Name
				if (error.response.data.name_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.name_error
					this.name.error_message = error.response.data.name_error
				} else {
					this.name.error_message = ''
				}
				// Telephone 1
				if (error.response.data.phone_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.phone_error
					this.phone.error_message = error.response.data.phone_error
				} else {
					this.phone.error_message = ''
				}
				// Address
				if (error.response.data.address_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.address_error
					this.address.error_message = error.response.data.address_error
				} else {
					this.address.error_message = ''
				}
				// Note
				if (error.response.data.note_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.note_error
					this.note.error_message = error.response.data.note_error
				} else {
					this.note.error_message = ''
				}
				// User Menu - Privileges
				if (error.response.data.menu_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.menu_error
				}
				// Created By
				if (error.response.data.created_by_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.created_by_error
				}
			}
		}
	}
}
</script>

<style scoped lang="scss">

	$light-green: lighten(green, 45);
	$light-orange: lighten(orange, 25);
	$light-red: lighten(red, 30);

	.register-user-form {
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
			background-color: $light-green;
		}
		.medium {
			background-color: $light-orange;
		}
		.weak {
			background-color: $light-red;
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
	} // Register User form

	.list-title {
		font-size: 17px;
	}

</style>
