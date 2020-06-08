<template>
	<div id="topBar">
		<nav class="navbar navbar-dark navbar-expand-lg p-0">
			<a class="navbar-brand col-sm-3 col-md-2 mr-0" href="/dashboard">{{payload.title}}</a>
			<!-- <input class="form-control form-control-dark w-50 mr-auto ml-2" type="text" placeholder="Search" aria-label="Search"> -->
			<ul class="navbar-nav px-3">
				<li class="nav-item text-nowrap">
					<a class="nav-link disabled" href="#">
						<font-awesome-icon :icon="['fas', 'user-tie']" class="icon" />
						<!-- TODO: Display logged in user's username -->
						{{ user.username }}
					</a>
				</li>
				<!-- <li class="nav-item text-nowrap">
					<a class="nav-link" href="docs">API Docs</a>
				</li> -->
				<li class="nav-item text-nowrap">
					<LogoutBtn />
					<!-- <a class="nav-link">Log out</a> -->
				</li>
			</ul>
		</nav>
	</div>
</template>

<script>
// Components
import LogoutBtn from '@/components/_globals/LogoutBtn'
// Helpers
import { mapGetters } from 'vuex'
// Font awesome icons
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faUserTie } from '@fortawesome/free-solid-svg-icons'
library.add(faUserTie)
dom.watch()

export default {
	name: 'DashboardTopBar',
	components: { LogoutBtn },

	props: {
		payload: { type: Object }
	},

	computed: {
		...mapGetters(['getUser'])
	},

	data() {
		return {
			user: {}
		}
	},

	created() {
		this.user = this.getUser
		console.log(this.user)
	}
}
</script>

<style lang="scss">
	#topBar {
		position: absolute;
		top: 0;
    left: 0;
		height: $dashboard-pageview-topbar-height;
		width: 100%;
		margin: 0 0;
		z-index: $dashboard-topbar-zindex;

		background-color: #000;
		border-color: blue !important;
		
		nav {
			display: flex;
			justify-content: space-between;
			height: 100%;
			align-items: center;

			ul {

				li.nav-item {
					&:not(:last-child) {
						margin-right: 15px;
					}
				}
			}
		}
	}
</style>