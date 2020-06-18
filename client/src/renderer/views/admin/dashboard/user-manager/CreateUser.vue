<template>
	<div class="admin-create-user">

		<form
			@submit="onSubmit"
			class="create-user-form"
		>
			<div class="form-group">
				<label for="username">Username <span class="required-field">*</span></label>
				<input
					type="text"
					v-model="form.fields.username"
					id="username"
					class="form-control"
				>
			</div>
			<div class="form-group">
				<label for="password">Password <span class="required-field">*</span></label>
				<input
					type="password"
					id="password"
					class="form-control"
					v-model="form.fields.password"
					@input="analyzePasswordStrength(form.fields.password), isPasswordConfirmed(form.fields.password2)"
				>
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
			</div>
			<div class="form-group">
				<label for="password2">Confirm password <span class="required-field">*</span></label>
				<input
					type="password"
					id="password2"
					class="form-control"
					v-model="form.fields.password2"
					@input="isPasswordConfirmed(form.fields.password2)"
				>

				<div class="form-group">
					<label for="username">Full name <span class="required-field">*</span></label>
					<input
						type="text"
						v-model="form.fields.name"
						id="username"
						class="form-control"
					>
				</div>

				<div
					class="confirmPasswordMessage"
					v-if="showPasswordStrength"
					v-bind:class="{
						passwordMatched : confirmPasswordMatched === true,
						passwordWrong : confirmPasswordMatched === false
					}"
				>
					<p class="pwMessageText">{{isPasswordConfirmedText}}</p>
					<!-- TODO: Add icons for match/wrong -->
				</div>
			</div>

			<div class="form-group">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					v-model="form.fields.email"
					class="form-control"
				>
			</div>

			<div class="form-group">
				<label for="phone">Phone</label>
				<input
					type="text"
					id="phone"
					v-model="form.fields.phone"
					class="form-control"
				>
			</div>

			<div class="form-group">
				<label for="address">Address</label>
				<input
					type="text"
					id="address"
					v-model="form.fields.address"
					class="form-control"
				>
			</div>

			<div class="form-group">
				<label for="note">Note</label>
				<textarea
					id="note"
					v-model="form.fields.note"
					class="form-control"
					rows="3"
				></textarea>
			</div>

			<div class="form-group">
				<label>Permissions</label>
				<select @change="dev()" class="form-control">
					<option value="user">user</option>
					<option value="admin">admin</option>
				</select>
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

			<button type="submit" class="btn create-user-btn">Submit</button>
		</form>
	</div>
</template>

<script>
// Components
// import AdminSideMenu from '@/components/admin/AdminSideMenu'
import UserService from '@/services/UserService'
import { mapGetters } from 'vuex'

export default {

	components: {
		// AdminSideMenu
	},

	computed: {
		...mapGetters(['getUser'])
	},

	data() {
		return {
			form: {
				fields: {
					username: 'jdoe1',
					password: '123123',
					password2: '123123',
					name: 'John Doe',
					email: 'jdoe@test.com',
					phone: '+1 123 123 13',
					address: 'Some st. 1312 1233',
					note: 'Short user note...',
					roles: ['user']
				},
				files: {
					profileImage: {
						src: null,
						file: null
					}
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

	methods: {
		dev() {
			// console.log(this.form.fields)
			const role = event.target.value
			this.form.fields.roles = [role]
		},

		async onSubmit() {
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
						text: `User with username <span style="color: blue; font-size:17px;">${user.username}</span> created successfully.`
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

	$light-green: lighten(green, 45);
	$light-orange: lighten(orange, 25);
	$light-red: lighten(red, 30);

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

		button.create-user-btn {
			@extend .btn-submit
		}
	}

	.list-title {
		font-size: 17px;
	}

</style>
