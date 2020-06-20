<template>
	<div>
		<CoreSidebar />

		<main>
			<TopBar :payload="topBarPayload" />
			<PageView />
		</main>
	</div>
</template>

<script>
export default {
	name: 'AdminDashboard',

	data() {
		return {
			topBarPayload: {
				title: 'Top bar heading'
			}
		}
	},

	components: {
		CoreSidebar: () => import('./core/Sidebar'),
		TopBar: () => import('./core/TopBar'),
		PageView: () => import('./core/PageView')
	}
}
</script>

<style scoped lang="scss">

	body, html {
		overflow-y: hidden;
	}

	main {
		position: absolute;
    top: 0;
    left: $dashboard-sb-base-width;
		width: calc(100% - #{$dashboard-sb-base-width});
		max-width: calc(100% - #{$dashboard-sb-base-width});
	}
</style>