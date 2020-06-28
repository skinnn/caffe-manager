<template>
	<div class="category-select">
		<label for="categories">Categories</label>
		<select id="categories" class="form-control categories-select"
			multiple
			@change="handleSelectCategory()"
		>
			<option value="">None</option>
			<!-- :selected="category.name === form.fields.categories[0].name" -->
			<option
				v-for="(category, index) in categories"
				:key="category.id"
				:value="category.id"
			>
				{{ index + 1 }}. {{ category.name }}
			</option>
		</select>
	</div>
</template>

<script>
// Services
import CategoryService from '@/services/CategoryService'

export default {
	name: 'CategorySelect',

	data() {
		return {
			categories: [],
			selected: []
		}
	},

	mounted() {
		this.getCategories()
	},

	methods: {
		async getCategories() {
			try {
				const res = await CategoryService.getCategories()
				const categories = res.data.categories
				this.categories = categories
			} catch (err) {
				console.error(err)
			}
		},

		handleSelectCategory() {
			this.selected = []
			var options = event.target.options
			var opt

			for (var i = 0, iLen = options.length; i < iLen; i++) {
				opt = options[i]

				if (opt.selected && opt.value !== '') {
					this.selected.push(opt.value)
				}
			}

			this.$emit('selectedCategory', this.selected)
		}
	}
}
</script>

<style>

</style>