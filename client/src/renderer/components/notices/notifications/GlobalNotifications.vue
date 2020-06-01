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
		<button @click="addNotification({text: 'Added notification..', type: 'error'})">
			Add
		</button>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
// Modules
import { v4 as uuidv4 } from 'uuid'

export default {
	name: 'GlobalNotifications',
	props: {
		text: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			// success, info, warning or error
			defalt: 'info'
		},
		timeout: {
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
				time: this.$props.timeout
			},

			options: {
				timeout: this.$props.timeout * 1000, // Convert milliseconds to seconds
				fadeOutTime: 500
			}
		}
	},

	async mounted() {
		// TODO: Write some tests
		let nots = [{text: 'Warning:', type: 'warning'}, {text: 'Info:', type: 'info'}, {text: 'Success:', type: 'success'}]
		nots.push({text: 'Error: Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit repudiandae aliquam vero sunt ex hic quas ipsum nulla? Repellat, eum.', type: 'error', timeout: 2})
		nots.forEach((n) => {
			for (let i = 0; i <= 3; i++) {
				this.addNotification(n)
			}
		})
	},

	methods: {
		addNotification(notification) {
			let id = uuidv4()
			const notifObj = {
				...notification,
				id: id,
				timeout: this.options.timeout ? setTimeout(() => this.removeNotificationById(id), this.options.timeout) : null
			}

			// Add notification to app state
			this.$store.dispatch('addNotification', notifObj)
			// Remove notification
			this.notifications.push(notifObj)
		},

		removeNotificationById(id) {
			var el = this.$refs.notificationList.querySelector(`li[data-id="${id}"]`)
			el.classList.remove('fade-in')
			el.classList.add('fade-out')
			let counter = 100
			
			this.notifications.forEach((notif, index) => {
				setTimeout(() => {
					if (notif.id === id) {
						// Clear notification's timeout so it doesnt fire after el from DOM is deleted
						clearTimeout(notif.timeout)
						// Remove notification from app state
						this.$store.dispatch('removeNotification', id)
						// Remove notification from UI
						this.notifications.splice(index, 1)
					}
				}, counter)
				counter += 300
			})
		},

		clearNotifications() {
			// Clear notifications from the state
			this.$store.dispatch('clearNotifications')
			let counter = 300

			// Remove notifications from the UI
			this.notifications.forEach((notif, index) => {
				setTimeout(() => this.removeNotificationById(notif.id), counter)
				counter += 300
			})
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