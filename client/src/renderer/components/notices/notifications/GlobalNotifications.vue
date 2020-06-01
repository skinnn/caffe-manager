<template>
	<div class="app-notification-wrapper">
		<!-- TODO: Create vuex store for notifications	 -->
		<button @click="addNotification({text: 'Added notification..', type: 'error'})">
			Add
		</button>
		<v-scroll-x-transition>
			<ul>
				<li v-for="(notification, index) in notifications" :key="index" class="notification">
					<v-alert
						value="true"
						:type="notification.type"
						class="notification"
						prominent
					>
						{{ notification.text }}
						<button @click="removeNotification(index)">
							<v-icon right>cancel</v-icon>
						</button>
					</v-alert>
				</li>
			</ul>
		</v-scroll-x-transition>
	</div>
</template>

<script>
// Modules
import { v4 as uuidv4 } from 'uuid'
import swal from 'sweetalert2'

export default {
	name: 'GlobalNotifications',
	props: {
		notification: {
			// text: {
			// 	type: String,
			// 	default: ''
			// },
			// type: {
			// 	type: String,
			// 	// success, info, warning or error
			// 	defalt: 'info'
			// }
		}
	},

	data() {
		return {
			notifications: [{text: 1, type: 'error'}, {text: 2, type: 'warning'}, {text: 3, type: 'info'}],
			nText: this.$props.text,
			type: this.$props.type,
			nVisible: this.$props.show,

			timer: {

			}
		}
	},

	mounted() {
		this.addNotification({text: 'Notification..', type: 'success'})
	},

	methods: {
		removeNotification(index) {
			event.preventDefault()
			this.notifications.splice(index, 1)
		},
		
		addNotification(notification) {
			// let notif = {
			// 	id: uuidv4(),
			// 	text: 'New notification.',
			// 	timer: setTimeout(() => { this.removeNotificationById(notif.id) }, 8000)
			// }
			this.notifications.push(notification)
		},

		removeNotificationById(id) {
			// let toDelete = this.notifications.find((el, index) => el.id === id)
			this.notifications.forEach((notif, index) => {
				if (notif.id === id) this.notifications.splice(index, 1)
			})
		}
	}

}
</script>

<style lang="scss" scoped>
	.app-notification-wrapper {
		position: fixed;
		left: 0;
		top: 0;
		padding: 10px;
		background-color: rgba(255, 255, 255, 0.4);
		border-radius: 10px;
		z-index: 9;

		.notification {
			display: flex !important;
		}
	}
</style>