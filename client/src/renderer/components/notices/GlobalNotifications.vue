<template>
	<div class="global-notifications">
		<div
			ref="notificationsWrapper"
			:class="['notifications-wrapper', showNotifications ? 'animation-notification-panel-in' : 'animation-notification-panel-out']"
			:style="fadeOutMs"
		>
			<button @click="toggleNotifications()" class="btn-toggle-notifications">
				<div v-if="notifications.length" class="notification-count">{{ notifications.length }}</div>
				<i class="material-icons">notifications</i>
			</button>
			<ul
				class="notification-list"
				ref="notificationList"
			>
				<li
					v-for="notification in notifications"
					:key="notification.id" class="notification-wrapper"
					:data-id="notification.id"
					:class="['animation-notification-in']"
				>
					<div
						:type="notification.type"
						:class="['notification', notification.type]"
					>
						<span class="message">
							<i class="type-icon material-icons">{{ getIconFromType(notification.type) }}</i>
							<span v-html="notification.text"></span>
						</span>
						<button @click="removeNotificationById(notification.id)" type="button" class="btn-remove">
							<v-icon right>cancel</v-icon>
						</button>
					</div>
				</li>
				<div class="bottom-bar">
					<button @click="handleAutoClear()" class="btn-autoclear">
						Auto clear <span class="autoclear-state">{{ options.autoClear ? 'ON' : 'OFF' }}</span>
					</button>
					<button @click="clearNotifications()" class="btn-clear-all">
						Clear all
					</button>
					<!-- <button @click="addNotification({text: 'Notification test..', type: 'success'})" class="btn blue">
						Add notification
					</button> -->
				</div>
			</ul>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

export default {
	name: 'GlobalNotifications',
	computed: {
		...mapGetters(['getNotifications']),
		fadeOutMs() {
			return {
				'--fadeout-miliseconds': this.options.fadeOutTime + 'ms'
			}
		},
		notifications() {
			return this.getNotifications
		}
	},

	data() {
		return {
			showNotifications: false,
			timers: [],
			options: {
				timeoutSeconds: 3,
				fadeOutTime: 500,
				autoClear: true
			}
		}
	},

	watch: {
		notifications(newNotifications, oldNotifications) {
			// TODO: After scrolling, maybe add an animation/effect on the newest added notification
			var newestNotification
			if (newNotifications.length > 0) {
				newestNotification = newNotifications[0]

				// Show panel if there are notifications
				this.$refs.notificationsWrapper.classList.remove('animation-notification-panel-out')
				this.$refs.notificationsWrapper.classList.add('animation-notification-panel-in')
			} else {
				newestNotification = newNotifications.slice().sort((a, b) => new Date() - new Date(a.created))[0]

				// Hide panel if there is 0 notifications
				this.$refs.notificationsWrapper.classList.remove('animation-notification-panel-in')
				this.$refs.notificationsWrapper.classList.add('animation-notification-panel-out')
			}

			// Set auto-clear
			if (this.options.autoClear && newNotifications && newNotifications.length) {
				// Timeout to remove the notification
				let timeout = setTimeout(() => this.removeNotificationById(newestNotification.id), this.options.timeoutSeconds * 1000)
				// Add timeout to array so it can be cleared
				this.addTimer(newestNotification.id, timeout)
			}

			// Scroll to bottom after notification is added
			setTimeout(() => {
				let list = this.$refs.notificationList
				// If there is a list in the DOM (not hidden), scroll to the bottom
				list ? list.scrollTop = list.scrollHeight : null
			}, 400)
		}
	},

	mounted() {
		// TODO: Write some tests
		// let nots = [{text: 'Error..', type: 'error'}, {text: 'Warning..', type: 'warning'}, {text: 'Info..', type: 'info'}, {text: 'Success..', type: 'success'}]
		// nots.forEach(notif => this.addNotification(notif))
	},

	methods: {
		addNotification(notification) {
			// Add notification to app state
			this.$store.dispatch('addNotification', notification)
		},

		removeNotificationById(id) {
			// Add fade out effect
			var el = this.$refs.notificationList ? this.$refs.notificationList.querySelector(`li[data-id="${id}"]`) : null
			el ? el.classList.remove('animation-notification-in') : null
			el ? el.classList.add('animation-notification-out') : null

			setTimeout(() => {
				this.$store.dispatch('removeNotification', id)
			}, this.options.fadeOutTime)
		},

		clearNotifications() {
			// animation-notification-out animation
			let domEls = this.$refs.notificationList.getElementsByTagName('li')
			for (var j = 0; j < domEls.length; j++) {
				domEls[j].classList.remove('animation-notification-in')
				domEls[j].classList.add('animation-notification-out')
			}

			// Clear notifications from the state
			setTimeout(() => {
				this.$store.dispatch('clearNotifications')
			}, this.options.fadeOutTime)
		},

		handleAutoClear() {
			// TODO: Save this state in localStorage/profileSettings
			this.options.autoClear = !this.options.autoClear
			// On
			if (this.options.autoClear) {
				// Reset timers
				this.timers = []
				this.notifications.forEach((el) => {
					let timeout = setTimeout(() => this.removeNotificationById(el.id), this.options.timeoutSeconds * 1000)
					// Add timeout to array so it can be cleared
					this.addTimer(el.id, timeout)
				})
			// Off
			} else {
				this.timers.forEach((el) => el.timeout ? clearTimeout(el.timeout) : null)
				// Reset timers
				this.timers = []
			}
		},

		addTimer(id, timeout) {
			this.timers.push({
				timeout: timeout,
				id: id
			})
		},

		toggleNotifications() {
			this.showNotifications = !this.showNotifications

			if (this.showNotifications) {
				this.$refs.notificationsWrapper.classList.add('animation-notification-panel-in')
				this.$refs.notificationsWrapper.classList.remove('animation-notification-panel-out')
			} else {
				this.$refs.notificationsWrapper.classList.add('animation-notification-panel-out')
				this.$refs.notificationsWrapper.classList.remove('animation-notification-panel-in')
			}
		},

		getIconFromType(notificationType) {
			const icons = {
				'success': 'check_circle',
				'error': 'error',
				'warning': 'warning',
				'info': 'info'
			}
			return icons[notificationType] || 'warning'
		}
	}

}
</script>

<style lang="scss" scoped>
	$notificaion-wrapper-width: 450px;

	.notifications-wrapper {
		display: flex;
		flex-direction: row;
		position: fixed;
		right: 0;
		bottom: 0;
		
		width: $notificaion-wrapper-width;
		max-height: 100vh;
		padding: 5px 0 8px 0;
		background-color: rgba(255, 255, 255, 0);
		border-radius: 10px;
		z-index: 9;

		ul {
			width: 450px;
			padding: 0 5px 5px 5px;
			margin: 0 0;
			overflow-y: auto;
			overflow-x: hidden;
			list-style: none;

			.notification-wrapper {
				display: flex;
				width: 100%;
				position: relative;
				right: 0;
				margin: 5px 0;
				opacity: 1;
				color: #fff;

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
		}

		.bottom-bar {
			padding-top: 5px;
			text-align: right;

			button {
				font-size: 12px;
				outline: none;

				&.btn-clear-all {
					padding: 5px;
					max-width: 50%;
					margin: 0 0 0 auto;
					padding: 3px 10px;
					border-radius: 5px;
					background-color: rgba(21, 80, 255, 0.9);
					color: #fff;
				}

				&.btn-autoclear {
					margin-right: 8px;

					.autoclear-state {
						font-weight: 600;
						background-color: rgba(255, 255, 255, 0.5);
					}
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

				&:hover {
					color: #fff;
				}
			}
		}

		/* Types */

		.error {
			background-color: #ff5252;
		}
		.info {}
		.warning {}

	}

	.btn-toggle-notifications {
		position: absolute;
		bottom: 0;
		left: -35px;
		height: 50px;

		&:hover {
			
		}

		.notification-count {
			position: absolute;
			top: 9px;
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

	/**
	 *	Animations and transitions	
	 */

	 	/* Notification panel */
		.animation-notification-panel-in {
			animation: notificationPanelSlideFromLeft 400ms;
			animation-fill-mode: forwards;
		}
		.animation-notification-panel-out {
			animation: notificationPanelSlideToRight 400ms;
			animation-fill-mode: forwards;
		}

		/* Single notification */
		.animation-notification-out {
			animation: fadeOut var(--fadeout-miliseconds),
								slideToRight var(--fadeout-miliseconds);
			animation-fill-mode: forwards;
		}
		.animation-notification-in {
			animation: fadeIn 1s,
								 slideFromLeft 200ms;
			animation-fill-mode: forwards;
			// animation-delay: 2s;
		}

		@keyframes notificationPanelSlideToRight {
			0% {
				right: 0;
			}
			100% {
				// right: -30%;
				right: -$notificaion-wrapper-width;
			}
		}
		@keyframes notificationPanelSlideFromLeft {
			0% {
				right: -100%;
			}
			100% {
				right: 0;
			}
		}

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

		@keyframes fadeOut {
			0% { opacity: 1; }
			100% { opacity: 0; }
		}
</style>