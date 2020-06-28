<template>
	<div class="article-view-page">
		<h1 class="heading">
			{{ article.name }}
			
			<button
				:class="[options.articleEditMode ? 'btn-delete' : 'btn-info']"
				@click="toggleArticleEditMode()"
				ref="editArticleBtn"
			>
				{{ options.articleEditMode ? 'Discard' : 'Edit' }}
			</button>
		</h1>

		<!-- <UpdateArticleForm
			:key="componentKey"
			:editMode="options.articleEditMode"
			@userUpdate="handleArticleUpdate"
			/> -->

	</div>

</template>

<script>
// Components
// import UpdateArticleForm from '@/components/forms/article/Update'
// Services
import ArticleService from '@/services/ArticleService'

export default {
	// components: { UpdateArticleForm },

	data() {
		return {
			article: {},
			options: {
				articleEditMode: false
			}
		}
	},

	mounted() {
		this.getArticleById()		
	},

	methods: {
		async getArticleById() {
			try {
				// const usId = this.$store.state.route.params.userId
				const id = this.$route.params.articleId
				const query = '?include=created_by,updated_by,image_id'

				const res = await ArticleService.getByid(id, query)
				const article = res.data.article

				this.article = article
			} catch (err) {
				console.log(err)
				this.$store.dispatch('addNotification', {
					type: 'error',
					text: err.response.data.message
				})
			}
		},

		toggleUserEditMode() {
			this.options.userEditMode = !this.options.userEditMode
		},

		handleUserUpdate(user) {
			this.user = user
			this.options.userEditMode = false
		},

		handlePasswordEditModeChange(mode) {
			if (mode === true) {
				this.$refs.editUserBtn.setAttribute('disabled', true)
			} else {
				this.$refs.editUserBtn.removeAttribute('disabled')
			}
		},

		forceComponentRerender() {
			this.componentKey += 1
		}
	}

}
</script>

<style scoped lang="scss">

</style>