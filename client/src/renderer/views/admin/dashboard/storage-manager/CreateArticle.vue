<template>
	<div class="admin-create-article">
		<v-layout column class="right-side">
			<!-- <v-flex>
				<div class="admin-header">
						<h1 class="heading">
							Create Article
						</h1>
						<LogoutBtn />
				</div>
			</v-flex> -->

			<v-flex class="admin-container">
				<v-form
					@submit.prevent="createArticle"
					enctype="multipart/form-data"
					class="create-article-form"
				>

					<h3>Name:</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							type="text"
							name="name"
							v-model="name"
							solo
						></v-text-field>
					</v-flex>

					<h3>Quantity:</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							type="number"
							name="quantity"
							v-model="quantity"
							solo
						></v-text-field>
					</v-flex>

					<h3>Price:</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							type="text"
							name="price"
							v-model="price"
							solo
						></v-text-field>
					</v-flex>

					<h3>Retail price:</h3>
					<v-flex xs12 sm8 d-flex>
						<v-text-field
							type="text"
							name="price"
							v-model="retail_price"
							solo
						></v-text-field>
					</v-flex>

					<h3>Add Image</h3>
					<div class="upload-image">
						<input
							type="file"
							@change="imagePreview(this)"
							id="articleImage"
							name="imageUpload"
							class="previewImgInput"
						/>
						<img id="previewImg" class="previewImg" src="" alt="">
						<!-- Preview Image placeholder -->
						<img v-if="!selectedImage" class="previewImgPlaceholder" src="" alt="">
					</div>

					<v-btn class="createArticleBtn green" type="submit">
						Create
					</v-btn>
				</v-form>

					<!-- Display messages -->
					<div class="error-msg" v-if="error" v-html="error" />
					<div class="success-msg" v-if="success" v-html="success" />
					<div class="info-msg" v-if="info" v-html="info" />

			</v-flex>
		</v-layout>
	</div>
</template>

<script>
// import AdminSideMenu from '@/components/admin/AdminSideMenu'
import ArticleService from '@/services/ArticleService'

export default {
	components: {
		// AdminSideMenu
	},
	data() {
		return {
			storageId: this.$store.state.route.params.storageId,
			subgroup: {
				_id: this.$store.state.route.params.subgroupId,
				name: this.$store.state.route.params.subgroupName
			},
			name: '',
			quantity: 0,
			price: 0,
			retail_price: 0,
			selectedImage: null,
			// Messages
			error: null,
			success: null,
			info: null
		}
	},
	methods: {
		imagePreview() {
			const img = document.getElementById('articleImage').files
			const previewImg = document.getElementById('previewImg')
			this.selectedImage = true
			var reader = new FileReader()
			reader.onload = function(e) {
				previewImg.src = e.target.result
			}
			reader.readAsDataURL(img[0])
		},
		async createArticle() {
			try {
				const formData = new FormData()
				// Get image
				let imagefile = document.querySelector('#articleImage')
				let image = imagefile.files[0]
				// Get and append text inputs to form data
				const artName = this.name
				const artPrice = this.price
				const artRetailPrice = this.retail_price
				const artQuantity = this.quantity
				// In Storage
				const storageId = this.storageId
				// In Subgroup
				const subgroupId = this.subgroup._id
				const subgroupName = this.subgroup.name

				// Some Validation
				if (artName !== '' && artName !== undefined) {
					if (artPrice !== 0 && artPrice !== '' && artPrice !== null && artPrice !== undefined) {
						if (artQuantity !== 0 && artQuantity !== '' && artQuantity !== null && artQuantity !== undefined) {
							// Append everything to form data
							formData.append('imageUpload', image)
							formData.append('storageId', storageId)
							formData.append('subgroupId', subgroupId)
							formData.append('subgroupName', subgroupName)
							formData.append('articleName', artName)
							formData.append('articlePrice', artPrice)
							formData.append('articleRetailPrice', artRetailPrice)
							formData.append('articleQuantity', artQuantity)

							// Create Article
							const response = (await ArticleService.createArticle(formData)).data

							// If successfully created
							if (response.created) {
								// Success message and timeout
								this.error = null
								this.info = null
								this.success = response.success
								setTimeout(() => {
									this.success = null
								}, 3000)
								// Reset input fields
								this.name = ''
								this.quantity = 0
								this.price = 0
								this.retail_price = 0
								image = null
								imagefile = null
								this.selectedImage = null
								const previewImg = document.getElementById('previewImg')
								previewImg.src = ''
							}
						} else {
							this.success = null
							this.info = null
							this.error = 'Article must have a quantity.'
							return
						}
					} else {
						this.success = null
						this.info = null
						this.error = 'Article must have a price.'
						return
					}
				} else {
					this.success = null
					this.info = null
					this.error = 'Article must have a name.'
					return
				}
			} catch (error) {
				this.success = null
				this.info = null
				this.error = error.response.data.error
			}
		}
	}
}
</script>

<style scoped lang="scss">

	.create-article-form {
		width: 600px;
		max-width: 600px;
		padding: 20px;

		.previewImg {
			min-width: 150px;
			min-height: 150px;
			max-width: 200px;
			max-height: 200px;
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

		.createArticleBtn {
			display: block;
			width: 25%;
		}
	}

	.list-title {
		font-size: 17px;
	}

</style>
