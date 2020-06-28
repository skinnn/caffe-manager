<template>
	<div class="placeholder-wrapper">
		<!-- <CircularLoader /> -->

		<!-- Loader -->
		<CircularLoader class="circular-loader"
			v-if="!loadingDone"
		/>

		<!-- Original -->
		<img class="image original"
			v-if="src && loadingDone"
			:src="src"
		>
		<!-- Fallback -->
		<img class="image fallback"
			v-if="fallbackSrc && loadingDone && !src"
			:src="require('@/assets/' + fallbackSrc)"
		>
	</div>
</template>

<script>
// Components
import CircularLoader from '@/components/loaders/CircularLoader'

export default {
	name: 'ImgPlaceholder',
	components: { CircularLoader },

	props: {
		isLoading: {
			type: Boolean,
			required: true
		},
		src: {
			type: String,
			required: true
		},
		fallbackSrc: {
			type: String,
			required: true
		}
	},

	data() {
		return {
			loadingDone: false
		}
	},

	mounted() {
		setTimeout(() => {
			this.loadingDone = true
		}, 2000)
	},

	watch: {
		isLoading: function(val) {
			if (val === false) {
				setTimeout(() => {
					this.loadingDone = true
				}, 200)
			}
		}
	}
}
</script>

<style scoped lang="scss">
	.placeholder-wrapper {

		.image {
			max-width: 200px;
		}
	}
</style>