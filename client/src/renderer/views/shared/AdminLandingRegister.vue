<template>
	<v-layout row class="mt-5">
		<v-flex xs6 offset-xs3>
			<div class="white elevation-5">
				<v-toolbar class="black toolbar" flat dense>
					<v-toolbar-title class="toolbar-title">Register Admin</v-toolbar-title>
				</v-toolbar>
				<div class="register-page pl-4 pr-4 pb-3 pt-4">
					<router-link to="/admin/login"><v-btn color="blue">Admin Login</v-btn></router-link>
					<router-link to="/admin/landingpage/register" event=""><v-btn color="blue">Admin Register</v-btn></router-link>
					<router-link to="/"><v-btn color="blue">User Login</v-btn></router-link>

					<v-form @submit.prevent="registerAdmin" enctype="multipart/form-data" name="register-admin-form" autocomplete="off">
						<v-text-field
							type="text"
							v-model="username"
							label="Username:"
							outline
						></v-text-field>
						<v-text-field
							type="text"
							v-model="name"
							label="Full name:"
							outline
						></v-text-field>
						<v-text-field
							type="password"
							v-model="password"
							label="Password:"
							outline
							autocomplete="new-password"
						></v-text-field>
						<v-text-field
							type="password"
							v-model="password2"
							label="Confirm Password:"
							outline
						></v-text-field>

						<div class="upload-image">
							<label>Add Image</label>
							<input id="adminImage" type="file" name="imageUpload" />
						</div>

						<!-- Display messages -->
						<div class="error-msg" v-if="error" v-html="error" />
						<div class="success-msg" v-if="success" v-html="success" />

						<v-btn type="submit" class="yellow">
							Create
						</v-btn>

					</v-form>
				</div>

			</div>
		</v-flex>
	</v-layout>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
	data() {
		return {
			username: '',
			password: '',
			password2: '',
			name: '',
			error: null,
			success: null,
			createdBy: {
				id: '',
				name: 'Registered from the landing page',
				username: ''
			}
		}
	},
	methods: {
		async registerAdmin() {
			try {
				const adminFormData = new FormData()
				// Get image
				const imagefile = document.querySelector('#adminImage')
				const image = imagefile.files[0]
				// Get and append text inputs to form data
				const adminUsername = this.username
				const adminName = this.name
				const adminPassword = this.password
				const adminPassword2 = this.password2
				// Created By
				const createdBy = this.createdBy
				// Append everything to form data
				adminFormData.append('imageUpload', image)
				adminFormData.append('adminUsername', adminUsername)
				adminFormData.append('adminName', adminName)
				adminFormData.append('adminPassword', adminPassword)
				adminFormData.append('adminPassword2', adminPassword2)
				adminFormData.append('createdBy', createdBy)

				// Register admin
				const response = (await AuthenticationService.registerAdmin(adminFormData)).data
				// If registering was successful redirect to the admin list
				if (response.admin) {
					// Set success message and timeout
					this.success = `Admin with username <span style="color: blue; font-size:17px;">${this.username}</span>
					 registered successfully.`
					this.error = ''
					setTimeout(() => {
						this.success = null
					}, 3000)

					// Set input values after registering to blank
					this.username = ''
					this.password = ''
					this.password2 = ''
					this.name = ''
				}
			} catch (error) {
				console.log(error)
				this.success = ''
				this.error = error.response.data.error
			}
		}
	}
}
</script>

<style scoped lang="scss">

	.toolbar-title {
		color: white;
	}

	.highlight-user {
		color: black;
		background-color: red;
	}

	.register-button {
		color: white;
	}

</style>
