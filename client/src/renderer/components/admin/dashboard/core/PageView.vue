<template>
	<div id="pageView">
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>
		<GlobalNotifications />
	</div>
</template>

<script>
import GlobalNotifications from '@/components/notices/GlobalNotifications'

export default {
	name: 'PageView',
	components: { GlobalNotifications }
}
</script>

<style lang="scss">

	#pageView {
		position: absolute;
		top: $dashboard-pageview-topbar-height;
		left: 0;
		width: 100%;
    height: calc(100vh - #{$dashboard-pageview-topbar-height});
		max-height: 100vh;
		padding: 20px 20px 0 20px;
		overflow-y: auto;
		overflow-x: hidden;
		background-color: #f4f4f4;
		z-index: $dashboard-pageview-zindex;
		
		.fade-enter-active,.fade-leave-active {
			transition: opacity 100ms;
		}
		.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
			opacity: 0;
		}
	}
</style>