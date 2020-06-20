<template>
	<nav id="admin-sidebar">
		<!-- Sidebar -->
    <ul class="navbar-nav sidebar">

			<!-- Sidebar - Brand -->
			<router-link to="/admin" class="sidebar-brand">
				<div class="sidebar-brand-icon">
					<img class="sidebar-logo" src="static/logo/caffe_manager_256x256.png" alt="Ignite">
				</div>
        <div class="sidebar-brand-text mx-3">
					Caffe manager
				</div>
			</router-link>

      <!-- Divider -->
      <hr class="sidebar-divider">

      <!-- Sub Heading -->
      <div class="sidebar-heading">
        Interface
      </div>

			<!-- Dashboard -->
			<li class="nav-item">
				<router-link to="/admin/home" class="nav-link collapsed">
					<font-awesome-icon :icon="['fas', 'chart-bar']" class="icon" />
          <span class="nav-item-name">Dashboard</span>
				</router-link>
			</li>

			<!-- Store -->
			<li class="nav-item">
				<router-link to="/admin/store" class="nav-link collapsed">
					<font-awesome-icon :icon="['fas', 'store']" class="icon" />
          <span class="nav-item-name">Store</span>
				</router-link>
			</li>

			<!-- Warehouse -->
			<li class="nav-item">
        <a @click="handleDropdownToggle('warehouse')" 
					:class="[!dropdowns.warehouse ? 'not-active-dropdown-link' : 'active-dropdown-link', 'nav-link', 'collapsed']"
					href="#" 
					data-toggle="collapse" 
					data-target="#warehouseDropdown" 
					aria-expanded="true" 
					aria-controls="warehouseDropdown"
				>
          <font-awesome-icon :icon="['fas', 'warehouse']" class="icon" /> 
					<span class="nav-item-name">Warehouse</span>
					<div 
						:class="[!dropdowns.warehouse ? 'active-dropdown' : 'not-active-dropdown', 'dropdown-arrow-icon']"
					>
						<font-awesome-icon :icon="['fas', 'angle-right']" />
					</div>
        </a>
        <div id="warehouseDropdown" class="collapse" aria-labelledby="warehouseDropdown" data-parent="#warehouseDropdown">
          <div class="py-2 collapse-inner">
            <!-- <h6 class="collapse-header">Storage manager</h6> -->
            <router-link to="/admin/storage/list" class="collapse-item">
							<font-awesome-icon :icon="['fas', 'list-ul']" class="icon" style=""/>
							Storage list
						</router-link>
						<router-link to="/admin/storage/create" class="collapse-item">
							<font-awesome-icon :icon="['fas', 'plus']" class="icon" style=""/>
							Create storage
						</router-link>         
          </div>
        </div>
      </li>

			<!-- User manager -->
      <li class="nav-item">
        <a @click="handleDropdownToggle('users')" 
					:class="[!dropdowns.users ? 'not-active-dropdown-link' : 'active-dropdown-link', 'nav-link', 'collapsed']"
					href="#" 
					data-toggle="collapse" 
					data-target="#usersDropdown" 
					aria-expanded="true" 
					aria-controls="usersDropdown"
				>
          <font-awesome-icon :icon="['fas', 'users']" class="icon" /> 
					<span class="nav-item-name">Users</span>
					<div 
						:class="[!dropdowns.users ? 'active-dropdown' : 'not-active-dropdown', 'dropdown-arrow-icon']"
					>
						<font-awesome-icon 
							:icon="['fas', 'angle-right']"
						/>
					</div>
        </a>
        <div id="usersDropdown" class="collapse" aria-labelledby="usersDropdown" data-parent="#usersDropdown">
          <div class="py-2 collapse-inner">
            <!-- <h6 class="collapse-header">User manager</h6> -->
            <router-link to="/admin/user/list" class="collapse-item">
							<font-awesome-icon :icon="['fas', 'list-ul']" class="icon" style=""/>
							User list
						</router-link>            
						<router-link to="/admin/user/create" class="collapse-item">
							<font-awesome-icon :icon="['fas', 'plus']" class="icon" style=""/>
							Create user
						</router-link>
          </div>
        </div>
      </li>

			<!-- Taxes -->
			<li class="nav-item">
        <a @click="handleDropdownToggle('taxes')" 
					:class="[!dropdowns.taxes ? 'not-active-dropdown-link' : 'active-dropdown-link', 'nav-link', 'collapsed']"
					href="#" 
					data-toggle="collapse" 
					data-target="#taxesDropdown" 
					aria-expanded="true" 
					aria-controls="taxesDropdown"
				>
          <font-awesome-icon :icon="['fas', 'chart-area']" class="icon" />
					<span class="nav-item-name">Taxes</span>
					<div 
						:class="[!dropdowns.taxes ? 'active-dropdown' : 'not-active-dropdown', 'dropdown-arrow-icon']"
					>
						<font-awesome-icon  :icon="['fas', 'angle-right']" />
					</div>
        </a>
        <div id="taxesDropdown" class="collapse" aria-labelledby="taxesDropdown" data-parent="#taxesDropdown">
          <div class="py-2 collapse-inner">
            <!-- <h6 class="collapse-header">Tax manager</h6> -->
						<router-link to="/admin/taxes/graph" class="collapse-item">
							Tax graph
						</router-link>   
						<router-link to="/admin/taxes/settings" class="collapse-item">
							Settings
						</router-link>
          </div>
        </div>
      </li>

      <!-- Divider -->
      <!-- <hr class="sidebar-divider"> -->

      <!-- Sub Heading -->
      <!-- <div class="sidebar-heading">
        Addons
      </div> -->

      <!-- Divider -->
      <hr class="sidebar-divider d-md-block">

			<!-- <div class="mt-3">
				<p v-if="isLoggedIn" style="color: #a5a5a5;">
					Logged in and token is set
					<small><br><span style="color: #fff;">{{ isLoggedIn }}</span></small>
				</p>
				<p v-else-if="!isLoggedIn">
					NOT logged in and token is:
					<small><span style="color: red;">{{ isLoggedIn }}</span></small>
				</p>
			</div> -->

			<!-- <sup style="font-weight: 400; text-transform: lowercase;" class="mt-2">v.1.0.0</sup> -->

      <!-- Sidebar Toggler (Sidebar) -->
      <!-- <div class="text-center d-none d-md-inline">
        <button class="rounded-circle border-0" id="sidebarToggle"></button>
      </div> -->
    </ul>

		<!-- Sticky bottom menu -->
		<footer class="bottom-menu">
			<p class="powered-by">
				Powered by <strong>Caffe Manager</strong> <sup>v.0.1.0</sup>
			</p>
		</footer>
	</nav>
</template>

<script>
// Font Awesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChartBar, faChartArea, faCog, faStore, faAngleUp, faAngleRight, faWarehouse, faUsers, faListUl, faPlus, faCalendarDay, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'
library.add(faChartBar, faChartArea, faCog, faStore, faAngleUp, faAngleRight, faWarehouse, faUsers, faListUl, faPlus, faCalendarDay, faMapMarkedAlt)

export default {
	name: 'AdminSidebar',

	data() {
		return {
			dropdowns: {
				warehouse: false,
				users: false,
				taxes: false
			}
		}
	},

	computed: {
		isLoggedIn() {
			return this.$store.getters.isLoggedIn
		}
	},

	methods: {
		handleDropdownToggle(which) {
			if (which === 'warehouse') {
				this.dropdowns.warehouse = !this.dropdowns.warehouse
			} else if (which === 'users') {
				this.dropdowns.users = !this.dropdowns.users
			} else if (which === 'taxes') {
				this.dropdowns.taxes = !this.dropdowns.taxes
			}
		}
	}
}
</script>

<style lang="scss">
/*
 * Sidebar
 */

#admin-sidebar {
	position: absolute;
	left: 0;
	top: 0;
	width: $dashboard-sb-base-width;
	height: 100vh;
	max-width: $dashboard-sb-base-width;
	max-height: calc(100% - 0px);
	z-index: $dashbaord-sb-zindex;

	background: rgb(0,0,0);
	background: linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(28,117,188,0.7) 100%, rgba(28,117,188,0.75) 100%),
							url('~@/assets/img/sidebar/sidebar-bg-1.jpg');
	background-repeat: no-repeat;
	background-position: 18% center;
	background-size: cover;
	// background-size: 200% 100%;

	.sidebar-brand {
		display: flex;
		justify-content: center;
		align-items: center;
		text-transform: uppercase;
		color: #fff;
		font-size: 13px;
		font-weight: 600;

		.sidebar-logo {
			width: 35px;
		}
	}

	ul.navbar-nav {
		position: relative;
		overflow-x: hidden;
		height: $dashboard-sb-height;
		padding: 10px 15px 0 15px;

		.nav-item {

			.collapsing,
			.collapse {

				.collapse-inner {

					&::before {
						content: '';
						position: absolute;
						left: 17px;
						top: 0;
						height: 100%;
						width: 3px;
						opacity: 1;
						// background: #e0f3ff;
						background: #fff;
						border-radius: 15px;
					}
				}
			}

			.router-link-active {
				color: $dashboard-sb-link-active-color;
				background-color: rgba(255, 255, 255, 0.9);
				border-radius: 20px;
				transition: background-color 200ms ease-out;

				.nav-item-name {
					font-weight: 600;
					// text-decoration: underline;
				}
			}

			.collapse-inner {
				position: relative;
				padding: 10px 0 10px 20px;
				background: transparent;

				h6 {
					display: block;
					opacity: 0.7;
					font-size: 0.7rem;
					color: #fff;
				}

				.collapse-item {
					display: block;
					margin-left: 10px;
					padding: 5px 5px 5px 12px;
					color: rgba($dashboard-sb-link-color, 1); //asd

					&.router-link-active {
						color: rgba($dashboard-sb-link-color, 1); //asd
						font-weight: 600;
					}
					
				}
			}

			.nav-link {
				padding-left: 10px;
				font-size: 16px;
				color: rgba($dashboard-sb-link-color, 1);

				&:hover {
					color: rgba(255, 255, 255, 0.7);
				}

				.nav-item-name {
				}
			}

			.dropdown-arrow-icon {
				float: right;
			}
		}
	}

	footer.bottom-menu {
			position: absolute;
			left: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: $dashboard-sb-footer-height;
			padding: 10px 0;
			// background-color: $dark-color;
			
			.powered-by {
				width: 100%;
				margin: 0;
				font-size: 10px;
				text-align: center;
				color: $dashboard-sb-link-color;
			}
		}

	.icon {
		width: 18px;
		// height: 18px;
		margin-right: 8px;
	}

	.sidebar-heading {
		color: $dashboard-sb-link-color;
		font-size: 12px;
		margin-bottom: 5px;
	}

	.sidebar-divider {
		background-color: #f4f4f4;
	}

	a:hover {
		text-decoration: none;
	}

	.active-dropdown {
		display: block;
		transition: all 200ms ease-in-out;
	}

	.not-active-dropdown {
		transform: rotate(90deg);
		transition: all 200ms ease-in-out;
	}

	.active-dropdown-link {
		color:#fff;
		font-weight: 600;
	}

	.not-active-dropdown-link {
		color:rgba(255, 255, 255, 0.8);
	}
}

@media screen and (max-width: 991px) {
	#admin-sidebar {
		.not-active-dropdown-link,
		.active-dropdown-link {
			padding-left: 40px;
		}
		.nav-item-name {
			display: none;
		}

		.dropdown-navbar-icon {
			margin-right: 5px;
    	margin-left: 8px;
		}
	}
}
</style>