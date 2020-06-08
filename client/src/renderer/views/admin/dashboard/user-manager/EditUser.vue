<template>
	<div class="admin-edit-page">
		<v-layout column class="right-side">
			<!-- <v-flex>
				<div class="admin-header">
						<h1 class="heading">
							Edit User: {{name.value}}
						</h1>
						<LogoutBtn />
				</div>
			</v-flex> -->

			<v-flex class="admin-container">
				<!-- Display messages -->
				<div class="error-msg" v-if="error" v-html="error" />
				<div class="success-msg" v-if="success" v-html="success" />

				<div class="admin-edit">
					<v-form
						@submit="onSubmit()"
						enctype="multipart/form-data"
						class="edit-user-form"
					>
						<h3>Username:</h3>
						<v-flex xs12 sm8 d-flex>
							<v-text-field
								title="Required field"
								:error-messages="username.error_message"
								type="text"
								maxlength="15"
								v-model="username.value"
								solo
							></v-text-field>
						</v-flex>

						<h3>Full name:</h3>
						<v-flex xs12 sm8 d-flex>
							<v-text-field
								title="Required field"
								:error-messages="name.error_message"
								type="text"
								maxlength="32"
								v-model="name.value"
								solo
							></v-text-field>
						</v-flex>

						<h3>Telephone 1:</h3>
						<v-flex xs12 sm8 d-flex>
							<v-text-field
								:error-messages="telephone1.error_message"
								type="text"
								maxlength="20"
								v-model="telephone1.value"
								solo
							></v-text-field>
						</v-flex>

						<h3>Telephone 2:</h3>
						<v-flex xs12 sm8 d-flex>
							<v-text-field
								:error-messages="telephone2.error_message"
								type="text"
								maxlength="20"
								v-model="telephone2.value"
								solo
							></v-text-field>
						</v-flex>

						<h3>Address:</h3>
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

						<h3>Image</h3>
						<br>
						<div class="upload-image">
							<input
								type="file"
								@change="imagePreview(this)"
								id="userImage"
								name="imageUpload"
							/>
							<img id="previewImg" class="previewImg"
								v-if="image.value && image.value !== ''"
								:src="`http://localhost:8080/${image.value}`"
								alt="">
							<!-- Preview Image placeholder -->
							<img v-if="!image.value && image.value !== ''" class="previewImgPlaceholder" src="" alt="">
						</div>
						<br>

						<v-btn type="submit" class="yellow">
							Save
						</v-btn>
					</v-form>
				</div>

			</v-flex>
		</v-layout>
	</div>
</template>

<script>
// Components
// import AdminSideMenu from '@/components/admin/AdminSideMenu'
// Services
import AdminService from '@/services/AdminService'
import UserService from '@/services/UserService'
// Helpers
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
			userId: {
				value: this.$store.state.route.params.userId
			},
			username: {
				value: '',
				error_message: ''
			},
			// password: {
			//   value: '',
			//   success_message: '',
			//   error_message: ''
			// },
			// password2: {
			//   value: '',
			//   success_message: '',
			//   error_message: ''
			// },
			name: {
				value: '',
				error_message: ''
			},
			image: {
				value: ''
			},
			telephone1: {
				value: '',
				error_message: ''
			},
			telephone2: {
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
			createdBy: this.$store.state.user._id,
			error: null,
			success: null
		}
	},

	async mounted() {
		// TODO: Create editingAdmin state in the user store module
		try {
			const data = { id: this.userId.value }

			const res = await UserService.getUserById(data)

			if (res.status === 200) {
				const user = res.data.user
				this.userId.value = user._id
				this.username.value = user.username
				this.name.value = user.name
				this.image.value = user.image
				this.telephone1.value = user.telephone1
				this.telephone2.value = user.telephone2
				this.address.value = user.address
				this.note.value = user.note
			}
		} catch (err) {
			this.success = null
			this.error = err.response.data.error
			console.error(err)
		}
	},

	methods: {
		imagePreview() {
			const img = document.getElementById('userImage').files
			const previewImg = document.getElementById('previewImg')
			var reader = new FileReader()
			reader.onload = function(e) {
				previewImg.src = e.target.result
			}
			reader.readAsDataURL(img[0])
		},

		async onSubmit() {
			event.preventDefault()
			try {
				// Get image
				let imagefile = document.querySelector('#userImage')
				let image = imagefile.files[0] || null
				// Permisions - user menu
				const userMenu = {
					home: this.userMenu.home,
					warehouse: this.userMenu.warehouse,
					tables: this.userMenu.tables
				}
				// Created By
				const formData = new FormData()
				// Get and append text inputs to form data
				// const password = this.password.value
				// const password2 = this.password2.value
				formData.append('imageUpload', image)
				formData.append('userUsername', this.username.value)
				formData.append('userName', this.name.value)
				// formData.append('userPassword', password)
				// formData.append('userPassword2', password2)
				formData.append('userTelephone1', this.telephone1.value)
				formData.append('userTelephone2', this.telephone2.value)
				formData.append('userAddress', this.address.value)
				formData.append('userNote', this.note.value)
				// formData.append('userMenu', userMenu)
				const createdBy = this.getUser._id
				formData.append('createdBy', createdBy)

				const userId = this.userId.value
				// const data = { id: userId, replace: formData }
				const res = await UserService.updateUserById(userId, formData)
				if (res.status === 200) {
					const user = res.data.user
					this.$router.push({
						name: 'admin-view-user',
						params: {userId}
					})
				}
			} catch (error) {
				console.log(error)

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
				// // Password
				// if (error.response.data.password_error) {
				//   this.success = null
				//   this.info = null
				//   this.error = error.response.data.password_error
				//   this.password.error_message = error.response.data.password_error
				// } else {
				//   this.password.error_message = ''
				// }
				// // Confirm Password
				// if (error.response.data.password2_error) {
				//   this.success = null
				//   this.info = null
				//   this.error = error.response.data.password2_error
				//   this.password2.error_message = error.response.data.password2_error
				// } else {
				//   this.password2.error_message = ''
				// }
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
				if (error.response.data.telephone1_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.telephone1_error
					this.telephone1.error_message = error.response.data.telephone1_error
				} else {
					this.telephone1.error_message = ''
				}
				// Telephone 2
				if (error.response.data.telephone2_error) {
					this.success = null
					this.info = null
					this.error = error.response.data.telephone2_error
					this.telephone2.error_message = error.response.data.telephone2_error
				} else {
					this.telephone2.error_message = ''
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

	.admin-edit {
		width: 100%;

		.edit-user-form {
			width: 600px;
			max-width: 600px;
			padding: 20px;

			.previewImg {
				min-width: 150px;
				min-height: 150px;
				max-width: 300px;
				max-height: 300px;
				border: 1px solid orange;
				border-radius: 3px;
				margin: 10px 0 0 10px;
				display: block;
			}

			.previewImgPlaceholder {
				width: 150px;
				height: 150px;
				border: 1px solid orange;
				border-radius: 3px;
				margin: 10px 0 0 10px;
				display: block;
			}

			.previewImgInput {
				margin: 5px 0 0 10px;
			}
		}
	}

	.list-title {
		font-size: 17px;
	}

</style>
