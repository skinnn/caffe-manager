<template>
	<header id="topBar">
		<nav class="navbar navbar-dark navbar-expand-lg">
			<div class="left">
				<BackBtn />
				<p class="location">{{ $route.path }}</p>
			</div>
			<div class="middle">
				<h2 class="page-heading">
					{{ $route.meta.title }}
				</h2>
			</div>
			<!-- <input class="form-control form-control-dark w-50 mr-auto ml-2" type="text" placeholder="Search" aria-label="Search"> -->
			<div class="right">
				<ul class="navbar-nav">
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
						<NotificationBtn />
					</li>
					<li class="nav-item text-nowrap">
						<LogoutBtn />
					</li>
				</ul>
			</div>
		</nav>
	</header>
</template>

<script>
// Components
import NotificationBtn from '@/components/_globals/NotificationBtn'
import LogoutBtn from '@/components/_globals/LogoutBtn'
import BackBtn from '@/components/_globals/BackBtn'
// Helpers
import { mapGetters } from 'vuex'
// Font awesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserTie } from '@fortawesome/free-solid-svg-icons'
library.add(faUserTie)

export default {
	name: 'DashboardTopBar',
	components: { BackBtn, LogoutBtn, NotificationBtn },

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
	}
}
</script>

<style lang="scss">
	header#topBar {
		position: absolute;
		top: 0;
    left: 0;
		height: $dashboard-pageview-topbar-height;
		width: 100%;
		margin: 0 0;
		z-index: $dashboard-topbar-zindex;

		background-color: #000;
		border-left: 1px solid #fff;
		
		nav {
			display: flex;
			justify-content: space-between;
			height: 100%;
			align-items: center;
			padding: 0 20px;

			.left {
				display: flex;
				flex-direction: row;
				align-items: center;
				height: 100%;

				.location {
					margin-left: 20px;
					font-size: 12px;
					color: $blue-color;
					align-self: center;
				}
			}

			.middle {
				position: absolute;
				left: 0 !important;
				right: 0 !important;
				margin: 0 auto;
				width: fit-content;

				h2.page-heading {
					color: #fff;
					font-size: 26px;
				}
			}

			.right {

				ul.navbar-nav {

					li.nav-item {
						&:not(:last-child) {
							margin-right: 20px;
						}
					}
				}
			}
		}

		.icon {
			margin-right: 5px;
		}
	}
</style>