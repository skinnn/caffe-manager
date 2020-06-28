<template>
	<div class="create-article-wrapper">
		<!-- Create article form -->
		<form class="create-article-form">
			<!-- Left -->
			<div class="row">
				<div class="col left">
					<div class="form-group">
						<label for="name">Name <span class="required-field">*</span></label>
						<input id="name" type="text" class="form-control" 
							v-model="form.fields.name"
						>
					</div>
					<div class="form-group">
						<label for="code">Code <span class="required-field">*</span></label>
						<input id="code" type="text" class="form-control" 
							v-model="form.fields.code"
						>
					</div>

					<div class="form-group">
						<label for="code">Storage <span class="required-field">*</span></label>
						<select id="storages" class="form-control storages-select"
							@change="handleSelectStorage()"
						>
							<option selected hidden value="">Select</option>
							<option
								v-for="storage in form.select.storages"
								:key="storage.id"
								:value="storage.id"
							>
								{{ storage.name }}
							</option>
						</select>
					</div>
					<div class="form-group">
						<CategorySelect @selectedCategory="handleSelectedCategory" />
					</div>

					<div class="form-group">
						<label for="units_in_stock">Units in stock <span class="required-field">*</span></label>
						<input id="units_in_stock" type="number" class="form-control" 
							v-model="form.fields.units_in_stock"
						>
					</div>
					<div class="form-group">
						<label for="purchase_price">Purchase price</label>
						<input id="purchase_price" type="number" class="form-control" 
							v-model="form.fields.purchase_price"
						>
					</div>
					<div class="form-group">
						<label for="selling_price">Selling price <span class="required-field">*</span></label>
						<input id="selling_price" type="number" class="form-control" 
							v-model="form.fields.selling_price"
						>
					</div>
					<div class="form-group">
						<label for="sale_price">Sale price</label>
						<input id="sale_price" type="number" class="form-control" 
							v-model="form.fields.sale_price"
						>
					</div>
					<div class="form-group">
						<label class="form-check-label" for="available_false">
							Product availability <small>(Can product be ordered or sold?)</small>
						</label>
						<div class="form-check">
							<input type="radio" class="form-check-input"
								id="available_true"
								v-model="form.fields.available"
								:value="true"
							>
							<label class="form-check-label" for="available_true">
								Available
							</label>
						</div>
						<div class="form-check">
							<input type="radio" class="form-check-input"
								id="available_false"
								v-model="form.fields.available"
								:value="false"
							>
							<label class="form-check-label" for="available_false">
								Not available
							</label>
						</div>
					</div>
					<div class="form-group">
						<label for="description">Description</label>
						<textarea id="description" type="text" class="form-control" 
							v-model="form.fields.description"
						></textarea>
					</div>
					<div class="form-group">
						<button class="btn-submit"
							@click="createArticle()"							
						>
						Create
						</button>
					</div>
				</div>

				<!-- Right -->
				<div class="col right">
					<div class="form-group">
						<label for="article_image">Image</label>
						<input id="article_image" class="form-control-file"
							type="file"
							@change="imagePreview()"
							ref="articleImageRef"
						>
						<img class="previewImg" :src="form.file.articleImage.src" alt="Article image">
					</div>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
// Components
import CategorySelect from '@/components/base/select/CategorySelect'
// Services
import ArticleService from '@/services/ArticleService'
import StorageService from '@/services/StorageService'
// Helpers
import { isEmptyObject } from '@/lib/helpers'

export default {
	name: 'CreateArticleForm',
	components: { CategorySelect },

	data() {
		return {
			user: {},
			form: {
				fields: {
					name: 'Pepsi',
					code: '1111',
					categories: [],
					storage_id: null,
					units_in_stock: 200,
					purchase_price: null,
					selling_price: null,
					sale_price: null,
					available: true,
					description: 'Short article description..'
				},
				file: {
					articleImage: {
						src: null,
						file: null
					}
				},
				select: {
					storages: []
				},
				// Data not to be manipulated/updated
				meta: {
					categories: [],
					storage_id: '',
					image_id: '',
					user_id: '',
					created: '',
					created_by: '',
					updated: '',
					updated_by: ''
				}
			}
		}
	},

	mounted() {
		this.getStorages()
		console.log('Form:', this.form)
	},

	methods: {
	
		async createArticle() {
			event.preventDefault()
			try {
				this.parseNumbersAndFloats()
				console.log('Sending: ', this.form.fields)
				// Send the request
				const response = await ArticleService.create(this.form.fields)
				const article = response.data.article
				console.log('Article response: ', response)

				// Created successfully
				if (response.status === 201) {
					const articleImage = this.form.file.articleImage.file
					if (articleImage) {
						this.createArticleAttachment(article.id, articleImage)
					}
					
					// this.resetFormFields()

					this.$store.dispatch('addNotification', {
						type: 'success',
						text: `<span style="color: #fff; font-size:17px;">${article.name}</span> has been created`
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

		async getStorages() {
			try {
				const res = await StorageService.getAllStorages()
				console.log(res)
				const storages = res.data
				this.form.select.storages = storages
				console.log(this.form)
			} catch (err) {
				console.error(err)
			}			
		},

		handleSelectStorage() {
			var options = event.target.options
			var opt

			for (var i = 0, iLen = options.length; i < iLen; i++) {
				opt = options[i]

				if (opt.selected && opt.value !== '') {
					this.form.fields.storage_id = opt.value
				}
			}
			
		},

		parseNumbersAndFloats() {
			this.form.fields.units_in_stock = this.form.fields.units_in_stock ? parseInt(this.form.fields.units_in_stock, 10) : null
			this.form.fields.purchase_price = this.form.fields.purchase_price ? parseFloat(this.form.fields.purchase_price) : null
			this.form.fields.selling_price = this.form.fields.selling_price ? parseFloat(this.form.fields.selling_price) : null
			this.form.fields.sale_price = this.form.fields.sale_price ? parseFloat(this.form.fields.sale_price) : 0
		},

		async createArticleAttachment(articleId, articleImage) {
			try {
				const formData = new FormData()
				formData.append('attachment', articleImage)
				// Upload attachment
				const attachmentResponse = await ArticleService.uploadArticleAttachment(articleId, 'article_image', formData)
				console.log('Attachment res: ', attachmentResponse)
				return attachmentResponse
			} catch (err) {
				console.error(err)
			}
		},

		handleSelectedCategory(selectedCategories) {
			this.form.fields.categories = selectedCategories
			// console.log('fields: ', this.form.fields)
		},

		imagePreview() {
			const file = event.target.files[0]
			// Set selected image
			this.form.file.articleImage.file = file
			// Preview selected image
			const previewImg = this.form.file.articleImage
			var reader = new FileReader()
			reader.onload = function(e) {
				previewImg.src = e.target.result
			}
			reader.readAsDataURL(file)
		},

		resetFormFields() {
			this.form.fields.name = ''
			this.form.fields.code = ''
			this.form.fields.units_in_stock = ''
			this.form.fields.purchase_price = null
			this.form.fields.selling_price = null
			this.form.fields.sale_price = null
			this.form.fields.available = true
			this.form.fields.description = ''

			this.$refs.articleImageRef.value = ''
			this.form.file.articleImage.src = ''
			this.form.file.articleImage.file = null
		}
	}
}
</script>

<style scoped lang="scss">

	form.create-article-form {
		// width: 600px;
		// max-width: 600px	;
		padding: 20px;

		h3 {
			height: 40px;
			display: inline-block;
			width: 370px;
		}

		.required-field {
			color: red;
		}

		select.categories-select {
			height: 100px;
			max-height: 100px;
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
