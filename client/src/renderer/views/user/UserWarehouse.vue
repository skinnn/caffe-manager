<template>
	<div class="user-home">
		<div>
			<user-side-menu />
		</div>
			<v-layout column class="right-side">
				<v-flex>
					<div class="user-header">
							<h1 class="heading">Warehouse</h1>
							<user-logout-btn />
					</div>
				</v-flex>

				<v-flex class="user-container">
					<!-- Display messages -->
					<div class="error-msg" v-if="error" v-html="error" />
					<div class="success-msg" v-if="success" v-html="success" />

					<!-- Should list the storages from the db -->
					<p>Storage 1</p>
					<p>Storage 2</p>
					<p>Storage 3</p>
					<p>Storage 4</p>
					<p>Storage 5</p>
					<p>Storage 6</p>
				</v-flex>
			</v-layout>
	</div>
</template>

<script>
// Components
import UserSideMenu from '@/components/user/UserSideMenu'

export default {
	components: {
		UserSideMenu
	},
	data() {
		return {
			error: null,
			success: null
		}
	}
}
</script>

<style scoped lang="scss">

	.user-header {
		position: fixed;
		min-height: 100px;
		width: 100%;
		color: white;
		background-color: #3d3d3d;
		border-bottom: 1px solid white;
	}

	.heading {
		position: relative;
		top: 25px;
		left: 6%;
		font-size: 31px;
	}

	.list-title {
		font-size: 17px;
	}

</style>
