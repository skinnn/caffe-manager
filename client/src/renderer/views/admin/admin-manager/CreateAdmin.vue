<template>
	<div class="admin-create-admin">
		<div>
			<admin-side-menu />
		</div>
		<v-layout column class="right-side">
			<v-flex>
				<div class="admin-header">
						<h1 class="heading">
							Create Admin
						</h1>
						<admin-logout-btn />
				</div>
			</v-flex>

			<v-flex class="admin-container">
				<v-form
					@submit="onSubmit"
					enctype="multipart/form-data"
					class="register-admin-form"
				>
					<h3 title="Required field">
						Username: <span class="required-field">*</span>
					</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							:success-messages="username.success_message"
							:error-messages="username.error_message"
							maxlength="15"
							type="text"
							v-model="username.value"
							solo
						></v-text-field>
					</v-flex>

					<h3 title="Required field">
						Password: <span class="required-field">*</span>
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
							v-model="password.value"
							:success-messages="password.success_message"
							:error-messages="password.error_message"
							@input="analyzePasswordStrength(password.value), isPasswordConfirmed(password2.value)"
							maxlength="32"
							type="password"
							solo
						></v-text-field>
					</v-flex>

					<h3 title="Required field">
						Confirm password: <span class="required-field">*</span>
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
							:success-messages="password2.success_message"
							:error-messages="password2.error_message"
							@input="isPasswordConfirmed(password2.value)"
							maxlength="32"
							type="password"
							v-model="password2.value"
							solo
						></v-text-field>
					</v-flex>

					<h3 title="Required field">
						Full name: <span class="required-field">*</span>
					</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							:success-messages="name.success_message"
							:error-messages="name.error_message"
							maxlength="32"
							type="text"
							v-model="name.value"
							solo
						></v-text-field>
					</v-flex>

					<h3>Telephone 1:</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							:success-messages="telephone1.success_message"
							:error-messages="telephone1.error_message"
							maxlength="20"
							type="text"
							v-model="telephone1.value"
							solo
						></v-text-field>
					</v-flex>

					<h3>Telephone 2:</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							:success-messages="telephone2.success_message"
							:error-messages="telephone2.error_message"
							maxlength="20"
							type="text"
							v-model="telephone2.value"
							solo
						></v-text-field>
					</v-flex>

					<h3>Address:</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							:success-messages="address.success_message"
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
							:success-messages="note.success_message"
							:error-messages="note.error_message"
							maxlength="250"
							type="text"
							v-model="note.value"
							placeholder="Write a short note about the person.."
							outline
						></v-textarea>
					</v-flex>

					<h3>Add image</h3>
					<br>
					<div class="upload-image">
						<input
							type="file"
							@change="handleFileChange()"
							name="imageUpload"
							class="previewImgInput"
						/>
						<img class="previewImg" :src="profileImage.src" alt="">
					</div>
					<br>

					<!-- Display messages -->
					<div class="error-msg" v-if="error" v-html="error" />
					<div class="success-msg" v-if="success" v-html="success" />
					<div class="info-msg" v-if="info" v-html="info" />

					<v-btn
						type="submit"
						class="yellow"
					>
						Create
					</v-btn>
				</v-form>
			</v-flex>

		</v-layout>
	</div>
</template>

<script>
// Services
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import AdminService from '@/services/AdminService'
// Helpers
import { mapGetters } from 'vuex'

export default {
	components: {
		AdminSideMenu
	},

	computed: {
		...mapGetters(['getUser', 'getUserToken'])
	},

	data() {
		return {
			user: {},

			name: {
				value: '',
				success_message: '',
				error_message: ''
			},
			username: {
				value: '',
				success_message: '',
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
			telephone1: {
				value: '',
				success_message: '',
				error_message: ''
			},
			telephone2: {
				value: '',
				success_message: '',
				error_message: ''
			},
			address: {
				value: '',
				success_message: '',
				error_message: ''
			},
			note: {
				value: '',
				success_message: '',
				error_message: ''
			},
			profileImage: {
				file: null,
				src: ''
			},
			createdBy: this.$store.state.user._id,
			showMessage: false,
			// Password Strength - default
			passwordStrength: 'weak',
			passwordStrengthText: '',
			// Is Password Confirmed - default
			confirmPasswordMatched: false,
			isPasswordConfirmedText: '',
			// Password Regexes ( Password Strength )
			strongRegex: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'),
			mediumRegex: new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'),
			// Messages
			error: null,
			info: null,
			success: null
		}
	},

	mounted() {
		this.user = this.getUser
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

		handleFileChange() {
			this.profileImage.file = event.target.files[0]
			let reader = new FileReader()

			reader.onload = (e) => {
				this.profileImage.src = e.target.result
			}
			reader.readAsDataURL(this.profileImage.file)
		},

		async onSubmit() {
			event.preventDefault()
			try {
				// Check if someone is trying to create account with 'admin' or 'root' usernames
				if (this.username.value !== 'admin' && this.username.value !== 'root') {
					// Check if logged in admin is the root admin
					if (this.user.root === true) {
						const adminFormData = new FormData()
						// Append everything to form data
						adminFormData.append('roles[]', 'admin')
						adminFormData.append('profileImage', this.profileImage.file)
						adminFormData.append('username', this.username.value)
						adminFormData.append('password', this.password.value)
						adminFormData.append('password2', this.password2.value)
						adminFormData.append('name', this.name.value)
						adminFormData.append('telephone1', this.telephone1.value)
						adminFormData.append('telephone2', this.telephone2.value)
						adminFormData.append('address', this.address.value)
						adminFormData.append('note', this.note.value)
						adminFormData.append('createdBy', this.createdBy) // ID of the user that created this admin (should always be root)

						const token = this.getUserToken
						// Create admin
						const res = await AdminService.createAdmin(token, adminFormData)
						// If registering was successful
						if (res.data.admin) {
							console.log('admin res: ', res)
							this.$router.push({
								name: 'admin-register'
							})

							// Set success message and timeout
							this.error = null
							this.info = null
							this.success = `Admin <span style="color: blue; font-size:17px;">${this.username.value}</span>
							 created successfully.`
							setTimeout(() => {
								this.success = null
							}, 4000)

							// Reset input fields after creating the admin
							this.resetInputFields()
						}
					}
				// If someone is trying to register the account with 'admin' or 'root' usernames
				} else {
					this.error = `Invalid username.`
					this.info = null
					this.success = null
					setTimeout(() => {
						this.success = null
					}, 3000)
				}
			} catch (error) {
				console.error(error)

				// Form Messages - Error/Success
				// Username
				if (error.response.data.username_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.username_error
					this.username.error_message = error.response.data.username_error
					setTimeout(() => {
						this.error = null
					}, 3000)
				} else {
					this.username.error_message = ''
				}
				// Password
				if (error.response.data.password_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.password_error
					this.password.error_message = error.response.data.password_error
					setTimeout(() => {
						this.error = null
					}, 4000)
				} else {
					this.password.error_message = ''
				}
				// Confirm Password
				if (error.response.data.password2_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.password2_error
					this.password2.error_message = error.response.data.password2_error
					setTimeout(() => {
						this.error = null
					}, 3000)
				} else {
					this.password2.error_message = ''
				}
				// Full Name
				if (error.response.data.name_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.name_error
					this.name.error_message = error.response.data.name_error
					setTimeout(() => {
						this.error = null
					}, 3000)
				} else {
					this.name.error_message = ''
				}
				// Telephone 1
				if (error.response.data.telephone1_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.telephone1_error
					this.telephone1.error_message = error.response.data.telephone1_error
					setTimeout(() => {
						this.error = null
					}, 3000)
				} else {
					this.telephone1.error_message = ''
				}
				// Telephone 2
				if (error.response.data.telephone2_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.telephone2_error
					this.telephone2.error_message = error.response.data.telephone2_error
					setTimeout(() => {
						this.error = null
					}, 3000)
				} else {
					this.telephone2.error_message = ''
				}
				// Address
				if (error.response.data.address_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.address_error
					this.address.error_message = error.response.data.address_error
					setTimeout(() => {
						this.error = null
					}, 3000)
				} else {
					this.address.error_message = ''
				}
				// Note
				if (error.response.data.note_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.note_error
					this.note.error_message = error.response.data.note_error
					setTimeout(() => {
						this.error = null
					}, 3000)
				} else {
					this.note.error_message = ''
				}
				// Created By
				if (error.response.data.created_by_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.created_by_error
				}
			}
		},

		resetInputFields() {
			this.username.value = ''
			this.password.value = ''
			this.password2.value = ''
			this.name.value = ''
			this.telephone1.value = ''
			this.telephone2.value = ''
			this.address.value = ''
			this.note.value = ''
			this.profileImage.file = null
			this.profileImage.src = ''
			// Hide password messages
			this.showMessage = false
			this.confirmPasswordMatched = null
		}
	}
}
</script>

<style scoped lang="scss">

	.register-admin-form {
		width: 600px;
		max-width: 600px;
		padding: 20px;

		h3 {
			height: 35px;
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
			padding-top: 3px;
			text-align: center;
			font-size: 13px;
			border-radius: 15px;

			.pwMessageText {
				display: table;
				margin: 3px auto;
				text-align: center;
				font-weight: 600;
			}
		}
		.strong {
			background-color: lighten(green, 35);
		}
		.medium {
			background-color: lighten(orange, 20);
		}
		.weak {
			background-color: lighten(red, 25);
		}

		.confirmPasswordMessage {
			float: right;
			width: 170px;
			height: 30px;
			padding-top: 3px;
			text-align: center;
			font-size: 13px;
			border-radius: 15px;

			.pwMessageText {
				display: table;
				margin: 3px auto;
				text-align: center;
				position: relative;
				font-weight: 600;
			}
		}
		.passwordWrong {
			background-color: lighten(red, 25);
		}
		.passwordMatched {
			text-align: center;
			background-color: lighten(green, 35);
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
	} // Register Admin Form


	.list-title {
		font-size: 17px;
	}

</style>
