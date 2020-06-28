<template>
	<div class="create-article-page">
		<h1>Create article</h1>

		<CreateArticleForm
		/>
	</div>

</template>

<script>
// Components
import CreateArticleForm from '@/components/forms/article/Create'

export default {
	components: { CreateArticleForm }

}
</script>

<style scoped lang="scss">

</style>