<template>
	<div class="admin-view-storage">
		<v-layout column class="right-side">
			<v-select
				v-model="pagination.itemsPerPage"
				:items="pagination.selectItemsPerPage"
				@change="changePagination"
				label="Items per page"
				class="pagination-items-per-page"
				required
			></v-select>
			
			<!-- TODO: Add animation for fetching/displaying Articles possibly with Scroll Reveal -->
			<!-- TODO: Create pagination and limit fetching Articles with ~20 per page -->
			<!-- Articles from the current storage -->
			<v-pagination
				v-if="pagination.totalPages !== null && pagination.totalPages !== 0"
				v-model="pagination.currentPage"
				:length="pagination.totalPages"
				@input="pageChanged"
			></v-pagination>

			<div id="list-div">
				<v-data-table
					:headers="headers"
					:items="displayedArticles"
					hide-actions
					dark
				>
					<template slot="items" slot-scope="{ item }">
						<td class="td article-image">
							<ImgPlaceholder
								@click.native="viewArticle(item.id)"
								:isLoading="isLoading"
								:src="item._articleImage"
								:fallbackSrc="'img/placeholders/article-image-placeholder.jpg'"
							/>
							<!-- <img @click="viewArticle(item.id)" class="article-image" :src="item.articleImage ? item.articleImage : ''" /> -->
						</td>
						<td class="td article-name">
							<span @click="viewArticle(item.id)">
								{{ item.name }}
							</span>
						</td>
						<td class="td article-quantity">
							<span>
								{{ item.units_in_stock }}
							</span>
						</td>
						<td class="td article-selling-price">
							<span>
								{{ item.selling_price }}
							</span>
						</td>
						<td class="td article-purchase-price">
							<span>
								{{ item.purchase_price }}
							</span>
						</td>
						<td class="td actions">
							<button class="btn-info"
								@click="viewArticle(item.id)"
							>
								View
							</button>
							<button class="btn-delete"
								@click="deleteArticle(item)"
							>
								Delete
							</button>
						</td>
					</template>
				</v-data-table>
			</div>
		</v-layout>
	</div>
</template>

<script>
// Components
import ImgPlaceholder from '@/components/base/img/ImgPlaceholder'
// Services
import ArticleService from '@/services/ArticleService'

export default {
	name: 'ArticleTable',
	components: { ImgPlaceholder },

	props: {
		storageId: String
	},

	data() {
		return {
			articles: [],
			displayedArticles: [],
			isLoading: false,
			// Table data
			pagination: {
				currentPage: 1,
				totalPages: null,
				itemsPerPage: 20,
				selectItemsPerPage: [
					1,
					5,
					20,
					50,
					80
				]
			},
			headers: [
				{ text: 'Image', align: 'left', sortable: false },
				{ text: 'Name', value: 'name' },
				{ text: 'In stock', value: 'units_in_stock' },
				{ text: 'Price', value: 'selling_price' },
				{ text: 'Purchase price', value: 'purchase_price' },
				{ text: 'Actions', sortable: false, align: 'center' }
			]
		}
	},
	
	mounted() {
		this.getArticles()
	},

	methods: {
		// TODO: Finish
		async getArticles() {
			try {
				this.isLoading = true

				const query = '?include=categories'
				const res = await ArticleService.get(query)
				const articles = res.data.articles
				console.log(articles[0])

				this.articles = articles
				const articlesToShow = await this.getAttachmentsForArticles(articles)
			
				this.articles = articlesToShow
				this.pageChanged()

				setTimeout(() => {
					this.isLoading = false
				}, 100)
			} catch (err) {
				console.error(err)
			}
		},

		async getAttachmentsForArticles(articles) {
			try {
				// TODO: Create watcher for visible users which will update the attachments
				let promises = articles.map(async(article) => {
					article._articleImage = ''

					// If article has an image
					if (article.image_id !== null) {
						const response = await ArticleService.getAttachmentByFileId(article.id, article.image_id)
						if (response && response.data) {
							const blob = response.data || null
							article._articleImage = URL.createObjectURL(blob)
						}
					}

					article._isLoading = false
					return article
				})

				const allArticles = await Promise.all(promises)
				return allArticles
			} catch (err) {
				console.error(err)
			}
		},

		changePagination() {
			let l = this.articles.length
			let s = this.pagination.itemsPerPage
			this.pagination.totalPages = Math.floor(l / s)
			let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
			let end = start + this.pagination.itemsPerPage
			// Set Displayed Articles
			this.displayedArticles = this.articles.slice(start, end)
			console.log(this.pagination.itemsPerPage)
		},

		// createArticlePage(storageId, subgroupId, subgroupName) {
		// 	this.$router.push({name: 'admin-create-article', params: {storageId, subgroupId, subgroupName}})
		// },

		// editArticleSubgroupPage(subgroupId) {
		// 	// TODO: Edit Article Subgroup
		// 	this.$router.push({name: 'admin-edit-article-subgroup', params: {subgroupId}})
		// },
		
		viewArticle(articleId) {
			event.stopPropagation()
			// let storageId = this.storageId
			this.$router.push({name: 'admin-article-view', params: { articleId: articleId }})
		},

		async pageChanged() {
			try {
				let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
				let end = start + this.pagination.itemsPerPage
				// Change Displayed Articles
				this.displayedArticles = this.articles.slice(start, end)
			} catch (error) {
				console.log(error)
			}
		},

		async deleteArticle(articleToDelete) {
			if (confirm('Are you sure?')) {
				try {
					// Delete article
					const res = await ArticleService.deleteArticle(articleToDelete.id)
					console.log(res)
					const article = res.data.article
					// If Article is deleted successfully
					if (res.status === 200) {
						this.articles = this.articles.filter((art) => art.id !== articleToDelete.id)
						this.pageChanged()
						this.$store.dispatch('addNotification', {
							type: 'success',
							text: `${articleToDelete.name} is deleted `
						})
					}
				} catch (err) {
					console.error(err)
					this.$store.dispatch('addNotification', {
						type: 'err',
						text: err.response.data.message
					})
				}
			}
		}
	}
}
</script>

<style scoped lang="scss">

	.pagination-items-per-page {
		max-width: 120px;
		margin-top: 25px;
	}

	#list-div {
		width: 100%;
		padding: 5px;

		tbody {

			tr td {
				text-align: left;
				height: 75px;
			}

			.article-image,
			.article-name {
				font-size: 16px;
				cursor: pointer;
			}

			.actions {
				text-align: center;
			}
		}

		.article-image {
			// max-width: 100px;
			max-height: 60px !important;
			// padding: 20px 10px;
			padding: 2px 5px;
			margin-left: 0;
		}
		
		.edit-btn {
			color: black;
			font-size: 15px;
		}
		.delete-btn {
			color: red;
			font-size: 15px;
			border: 1px solid red;
		}
	}

</style>
