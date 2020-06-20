<template>
	<div>
		<!-- Temporary notifications -->
		
		<ul
			v-if="!showNotifications && notifications.length > 0"
			class="notification-list temporary-list"
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
		</ul>

		<!-- Notifications panel -->
		<div
			ref="notificationsWrapper"
			:class="['notifications-panel', 'animation-notification-panel-hidden']"
			:style="fadeOutMs"
		>
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
			</ul>
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
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

export default {
	name: 'GlobalNotifications',
	
	computed: {
		...mapGetters(['getNotifications', 'getNotificationsVisibility']),
		fadeOutMs() {
			return {
				'--fadeout-miliseconds': this.options.fadeOutTime + 'ms'
			}
		},
		notifications() {
			return this.getNotifications
		},
		showNotifications() {
			return this.getNotificationsVisibility
		}
	},

	data() {
		return {
			// showNotifications: false,
			// showNotifications: this.getNotificationsVisibility,
			timers: [],
			options: {
				timeoutSeconds: 3,
				fadeOutTime: 500,
				autoClear: true
			}
		}
	},

	mounted() {
		// TODO: Write some tests
		// let nots = [{text: 'Error..', type: 'error'}, {text: 'Warning..', type: 'warning'}, {text: 'Info..', type: 'info'}, {text: 'Success..', type: 'success'}]
		// nots.forEach(notif => this.addNotification(notif))
		this.clearAll()
	},

	watch: {
		showNotifications: function(isVisible) {
			if (isVisible) {
				this.$refs.notificationsWrapper.classList.add('animation-notification-panel-in')
				this.$refs.notificationsWrapper.classList.remove('animation-notification-panel-out')
			} else {
				this.$refs.notificationsWrapper.classList.add('animation-notification-panel-out')
				this.$refs.notificationsWrapper.classList.remove('animation-notification-panel-in')
			}
		},
		notifications(newNotifications, oldNotifications) {
			// TODO: After scrolling, maybe add an animation/effect on the newest added notification
			var newestNotification
			if (newNotifications.length > 0) {
				newestNotification = newNotifications[0]

				// Show panel if there are notifications
				// this.$refs.notificationsWrapper.classList.remove('animation-notification-panel-out')
				// this.$refs.notificationsWrapper.classList.add('animation-notification-panel-in')
			} else {
				newestNotification = newNotifications.slice().sort((a, b) => new Date() - new Date(a.created))[0]

				// Hide panel if there is 0 notifications
				// this.$refs.notificationsWrapper.classList.remove('animation-notification-panel-in')
				// this.$refs.notificationsWrapper.classList.add('animation-notification-panel-out')
			}

			// Set auto-clear
			if (this.options.autoClear && newNotifications && newNotifications.length) {
				// Timeout to remove the notification
				let timeout = setTimeout(() => this.removeNotificationById(newestNotification.id), newestNotification.timeout * 1000)
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

	methods: {
		addNotification(notification) {
			// Add notification to the store
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
			this.clearAll()
		},

		clearAll() {
			// If On
			if (this.options.autoClear) {
				// Reset timers
				this.timers = []
				this.notifications.forEach((el) => {
					let timeout = setTimeout(() => this.removeNotificationById(el.id), el.timeout * 1000)
					// Add timeout to array so it can be cleared
					this.addTimer(el.id, timeout)
				})
			// If Off
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
			console.log('INITIAL: ', this.showNotifications)
			// this.showNotifications = !this.showNotifications
			this.$store.dispatch('setNotificationsVisibility', !this.showNotifications)
		},

		getIconFromType(notificationType) {
			const icons = {
				success: 'check_circle',
				error: 'error',
				warning: 'warning',
				info: 'info'
			}
			return icons[notificationType]
		}
	}

}
</script>

<style lang="scss" scoped>
	.notifications-panel {
		// display: flex;
		// flex-direction: row;
		position: fixed;
		right: 0;
		bottom: 0;
		
		width: $notificaion-panel-width;
		height: $notificaion-panel-height;
		background-color: rgba(255, 255, 255, 1);
		border-left: 1px solid grey;
		border-top: 1px solid grey;
		border-radius: 5px;
		z-index: 3;
	}

	ul.notification-list {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		position: absolute;
		bottom: $notificaion-panel-menu-height;
		left: 0;
		width: 450px;
		height: $notificaion-panel-messages-height;
		padding: 0 5px 0 5px;
		margin: 0 0;
		overflow-y: auto;
		overflow-x: hidden;
		list-style: none;

		.notification-wrapper {
			display: flex;
			width: 100%;
			position: relative;
			right: 0;
			margin: 5px 0 0 0;
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
				}
			}
		}
	}

	.bottom-bar {
		position: absolute;
		bottom: 0;
		right: 0;
		height: $notificaion-panel-menu-height;
		width: 100%;
		margin-right: 5px;
		padding: 8px 8px;
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
	.success {
		background-color: $success;
	}

	.info {
		background-color: $info;
	}
	.warning {
		background-color: $warning;
	}

	/**
	 * Temporary notifications
	 */
	ul.temporary-list {
		position: fixed;
		left: auto;
		right: 0;
		bottom: 20px;
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
	.animation-notification-panel-hidden {
		right: -$notificaion-panel-width;
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
			right: -$notificaion-panel-width;
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