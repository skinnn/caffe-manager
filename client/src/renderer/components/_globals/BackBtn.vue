<template>
	<button @click="handleGoBack()" ref="button" class="btn back-btn disabled">
		<font-awesome-icon :icon="['fas', 'arrow-circle-left']" class="icon" />
		Back
	</button>
</template>

<script>
// Font awesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons'
library.add(faArrowCircleLeft)

export default {
	name: 'BackBtn',

	data() {
		return {
			lastRoute: null
		}
	},

	watch: {
		$route() {
			// if (this.$route.query.canNavigate === false) {
			// 	event.preventDefault()
			// 	this.$refs.button.classList.add('disabled')
			// 	return
			// } else {
			// 	this.$refs.button.classList.remove('disabled')
			// 	return
			// }
			this.$refs.button.classList.remove('disabled')
		}
	},

	methods: {
		handleGoBack() {
			if (this.$route.name !== this.lastRoute) {
				this.lastRoute = this.$route.name
				this.$router.back()
				this.$refs.button.classList.add('disabled')
			} else {
				console.log('trying to go to the same route')
				console.log('lastRoute: ', this.lastRoute)
				console.log('this.$route: ', this.$route.name)
				this.$refs.button.classList.add('disabled')
			}

			// console.log('query: ', this.$route.query)
			// if (this.$route.query.canNavigate === false) {
			// 	console.log('hit')
			// 	this.$refs.button.classList.add('disabled')
			// 	return
			// } else {
			// 	this.$refs.button.classList.remove('disabled')
			// 	return
			// }
		}
	}
}
</script>

<style scoped lang="scss">

	button.back-btn {
		color: #fff;
		
		.icon {
			// width: 2rem;
		}
	}
</style>