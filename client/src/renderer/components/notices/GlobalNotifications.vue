<template>
	<div class="app-notification-wrapper">
		<!-- TODO: Create store statte for notifications/errors/warnings	 -->
		<ul ref="notificationList">
			<li
				v-for="notification in notifications"
				:key="notification.id" class="notification-wrapper"
				:data-id="notification.id"
				:class="['fade-in']"
				:style="fadeOutMs"
			>
				<div
					:type="notification.type"
					:class="['notification', notification.type]"
				>
					<span class="message">
						<i class="type-icon material-icons">{{ getIconFromType(notification.type) }}</i>
						{{ notification.text }}
					</span>
					<button @click="removeNotificationById(notification.id)" type="button" class="btn-remove">
						<v-icon right>cancel</v-icon>
					</button>
				</div>
			</li>
		</ul>
		<button @click="clearNotifications()">
			Clear all
		</button>
		<br>
		<button @click="addNotification({text: 'Notification test..', type: 'success'})" class="btn blue">
			Add notification
		</button>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
// Events
import { GlobalNotificationEvent } from '@/lib/Events'

export default {
	name: 'GlobalNotifications',
	props: {
		text: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			// success, info, warning, error
			defalt: 'info'
		},
		time: {
			type: Number,
			default: 10 // time for which notification is deleted, in seconds
		}
	},

	computed: {
		...mapGetters(['getNotifications']),
		
		fadeOutMs() {
			return {
				'--fadeout-miliseconds': this.options.fadeOutTime + 'ms'
			}
		}
	},

	data() {
		return {
			notifications: [],

			notification: {
				text: this.$props.text,
				type: this.$props.type,
				time: this.$props.time
			},

			options: {
				timeout: 5000,
				fadeOutTime: 500
			}
		}
	},

	created() {
		// register an event handler
		this.$eventBus.listen(GlobalNotificationEvent, (notification) => this.handleNotificationEvent(notification))
	},

	mounted() {
		// TODO: Write some tests
		// let nots = [{text: 'Error..', type: 'error'}, {text: 'Warning..', type: 'warning'}, {text: 'Info..', type: 'info'}, {text: 'Success..', type: 'success'}]
		// nots.forEach(notif => this.addNotification(notif))
	},

	methods: {
		handleNotificationEvent(notification) {
			this.addNotification(notification)
		},

		addNotification(notification) {
			let id = uuidv4()
			const notifObj = {
				...notification,
				id: id,
				timeout: setTimeout(() => this.removeNotificationById(id), this.options.timeout)
			}

			// Add notification to app state
			this.$store.dispatch('addNotification', notifObj)
			// Remove notification
			this.notifications.push(notifObj)
		},

		removeNotificationById(id) {
			// Add fade out effect
			var el = this.$refs.notificationList.querySelector(`li[data-id="${id}"]`)
			el.classList.remove('fade-in')
			el.classList.add('fade-out')
			
			// Remove notification from the UI
			let len = this.notifications.length
			for (let i = len; i > 0; i--) {
				let index = i - 1
				if (this.notifications[index].id === id) {
					setTimeout(() => {
						el.remove()
						if (this.notifications[index] && this.notifications[index].timeout) clearTimeout(this.notifications[index].timeout)
						// Remove notification from app state
						this.$store.dispatch('removeNotification', id)
						// Remove notification from UI
						this.notifications.splice(index, 1)
					}, this.options.fadeOutTime)
				}
			}
		},

		clearNotifications() {
			// Clear notifications from the state
			this.$store.dispatch('clearNotifications')

			let domEls = this.$refs.notificationList.getElementsByTagName('li')
			for (var j = 0; j < domEls.length; j++) {
				domEls[j].classList.remove('fade-in')
				domEls[j].classList.add('fade-out')
			}

			setTimeout(() => {
				// Remove notifications
				let len = this.notifications.length
				for (let i = len; i > 0; i--) {
					let index = i - 1
					// Clear timeout first
					clearTimeout(this.notifications[index].timeout)
					this.notifications.splice([index], 1)
				}
			}, this.options.fadeOutTime)
		},

		getIconFromType(type) {
			const icons = {
				'success': 'check_circle',
				'error': 'error',
				'warning': 'warning',
				'info': 'info'
			}
			return icons[type] || 'warning'
		}
	}

}
</script>

<style lang="scss" scoped>
	.app-notification-wrapper {
		position: fixed;
		right: 0;
		bottom: 0;
		width: 450px;
		padding: 10px;
		background-color: rgba(255, 255, 255, 0.7);
		border-radius: 10px;
		z-index: 9;

		ul {
			padding: 0 0;
			margin: 0 0;
			list-style: none;
		}

		.fade-in {
			animation: fadeIn 1s,
								 slideFromLeft 200ms;
			animation-fill-mode: forwards;
			// animation-delay: 2s;
		}

		.fade-out {
			animation: fadeOut var(--fadeout-miliseconds),
								 slideToRight var(--fadeout-miliseconds);
			animation-fill-mode: forwards;
		}

		.notification-wrapper {
			display: flex;
			position: relative;
			right: 0;
			margin: 5px 0;
			opacity: 1;
			color: #fff;
			display: block;

			.notification {
				position: relative;
				width: 100%;
				margin-left: auto;
				margin-right: 0;
				padding: 16px;
				border-radius: 5px;

				.message {
					display: flex;
					max-width: 96%;
					font-size: 13px;
					margin-right: 20px;
					text-align: left;
					vertical-align: middle;
					// letter-spacing: 0.05em;
				}
			}
		}

		.type-icon {
			max-width: 20px;
			vertical-align: bottom;
			margin-right: 8px;
			font-size: 20px;
			color: rgba(0, 0, 0, 0.3);
		}

		.btn-remove {
			display: static;
			position: absolute;
			top: 0;
			right: 0;
			margin: 5px 5px 0 0;

			i {
				margin: 0;
				padding: 0;
			}
		}

		/* Types */

		.error {
			background-color: #ff5252;
		}
		.info {}
		.warning {}

		@keyframes slideFromLeft {
			0% {
				right: -100%;
			}
			100% {
				right: 0;
			}
		}

		@keyframes slideToRight {
			0% {
				right: 0;
			}
			100% {
				right: -100%;
			}
		}

		@keyframes fadeIn {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}

		// @keyframes fadeOut {
		// 	0% {
		// 		opacity: 1;
		// 	}
		// 	100% {
		// 		opacity: 0;
		// 	}
		// }

		@keyframes fadeOut {
			0% { opacity: 1; }
			100% { opacity: 0; }
		}
	}
</style>