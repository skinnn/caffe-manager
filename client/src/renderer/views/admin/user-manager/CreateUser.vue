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
							maxlength="15"
							type="text"
							v-model="form.fields.username"
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
							@input="analyzePasswordStrength(form.fields.password), isPasswordConfirmed(form.fields.password2)"
							maxlength="32"
							type="password"
							v-model="form.fields.password"
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
							@input="isPasswordConfirmed(form.fields.password2)"
							maxlength="32"
							type="password"
							v-model="form.fields.password2"
							solo
						></v-text-field>
					</v-flex>

					<h3 title="Required field">
						Full name <span class="required-field">*</span>
					</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							maxlength="32"
							type="text"
							v-model="form.fields.name"
							solo
						></v-text-field>
					</v-flex>

					<h3 title="Required field">
						Email
					</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							title="Required field"
							maxlength="30"
							type="text"
							v-model="form.fields.email"
							solo
						></v-text-field>
					</v-flex>

					<h3>Phone</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							maxlength="20"
							type="text"
							v-model="form.fields.phone"
							solo
						></v-text-field>
					</v-flex>

					<h3>Address</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							maxlength="35"
							type="text"
							v-model="form.fields.address"
							solo
						></v-text-field>
					</v-flex>

					<h3>Note:</h3>
					<v-flex xs12 sm8 d-flex>
						<v-textarea
							maxlength="250"
							type="text"
							v-model="form.fields.note"
							placeholder="Write a short note about the person.."
							outline
						></v-textarea>
					</v-flex>

					<!-- TODO: Set it up and test -->
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
						<img class="previewImg" :src="form.files.profileImage.src" alt="Profile image">
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
		...mapGetters(['getUser'])
	},

	data() {
		return {
			form: {
				fields: {
					// TODO: Create multiselect for choosing roles istead of hardcoded value user
					roles: ['user'],
					username: 'jdoe1',
					password: '123123',
					password2: '123123',
					name: 'John Doe',
					email: 'jdoe@test.com',
					phone: '+1 123 123 13',
					address: 'Some st. 1312 1233',
					note: 'Short user note...'
					// TODO: Get userMenu/permissions from the API
					// userMenu: {
					// 	home: true, // Default is that all users have home page
					// 	warehouse: false,
					// 	tables: false
					// },
				},
				files: {
					profileImage: {
						src: null,
						file: null
					}
				}
			},

			showMessage: false,
			// Password strength
			passwordStrength: 'weak',
			passwordStrengthText: '',
			// Is password confirmed
			confirmPasswordMatched: false,
			isPasswordConfirmedText: '',
			// TODO: Centralize regexes/form policies, constants, create helpers
			// Password regexes ( password strength )
			strongRegex: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'),
			mediumRegex: new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'),
			// Form messages
			info: null,
			error: null,
			success: null
		}
	},

	methods: {
		async onSubmit() {
			event.preventDefault()
			try {
				// TODO: Finish permissions & roles

				// Send the request
				const response = await UserService.createUser(this.form.fields)
				const data = response.data

				// Created successfully
				if (response.status === 201) {
					const profileImage = this.form.files.profileImage.file
					if (profileImage) {
						const attachmentResponse = await this.createUserAttachment(profileImage)
					}
					
					this.resetFormFields()

					// Set success message and timeout
					this.error = null
					this.info = null
					this.success = `User with username <span style="color: blue; font-size:17px;">${data.user.username}</span> created successfully.`
					setTimeout(() => {
						this.success = null
					}, 5000)
				}
			} catch (error) {
				console.log(error.response.data)

				// Display form error message
				this.error = error.response.data.message
				this.info = null
				this.success = null
			}
		},

		async createUserAttachment(profileImage) {
			try {
				const formData = new FormData()
				const identifier = 'profile_image'
				formData.append('attachment', profileImage)
				const userId = this.getUser._id
				// Upload image
				const fileResponse = await UserService.createUserAttachment(userId, identifier, formData)
				return fileResponse
			} catch (err) {
				console.error(err)
			}
		},

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
			// Set all Values to default after successful registering
			this.form.fields.username = ''
			this.form.fields.password = ''
			this.form.fields.password2 = ''
			this.form.fields.email = ''
			this.form.fields.name = ''
			this.form.fields.phone = ''
			this.form.fields.address = ''
			this.form.fields.note = ''
			this.form.files.profileImage.file = null
			this.form.files.profileImage.src = ''
			// Hide password messages
			this.showMessage = false
			this.confirmPasswordMatched = null
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
