<template>
	<button
		@click="toggleNotifications()"
		class="btn-toggle-notifications"
	>
		<div v-if="notificationCount > 0" class="notification-count">
			{{ notificationCount }}
		</div>
		<i class="material-icons icon">notifications</i>
	</button>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'NotificationButton',

	computed: {
		...mapGetters(['getNotificationCount', 'getNotificationsVisibility']),
		notificationCount() {
			return this.getNotificationCount
		}
	},

	methods: {
		toggleNotifications() {
			this.$store.dispatch('setNotificationsVisibility', !this.getNotificationsVisibility)
		}
	}
}
</script>

<style scoped lang="scss">
	.btn-toggle-notifications {
		// position: absolute;
		// bottom: 0;
		// left: -35px;
		// height: 50px;
		position: relative;
		height: 100%;

		&:hover {
			color: $blue-color;
			transition: color 250ms ease-in-out;
		}

		.icon {
			color: #fff;
		}

		.notification-count {
			position: absolute;
			top: 0;
			right: 13px;
			min-width: 14px;
			height: 14px;
			background-color: red;
			padding: 0 2px;
			color: #fff;
			border-radius: 7px;
			font-size: 10px;
			vertical-align: middle;
			text-align: center;
		}
	}
</style>