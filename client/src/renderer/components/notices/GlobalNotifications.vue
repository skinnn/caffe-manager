<template>
	<div
		v-if="notifications.length"
		class="app-notification-wrapper"
	>
		<ul
			class="notification-list"
			ref="notificationList"
		>
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
		<div class="bottom-bar">
			<button @click="clearNotifications()" class="btn-clear-all">
				Clear all
			</button>
		</div>
		<!-- <button @click="addNotification({text: 'Notification test..', type: 'success'})" class="btn blue">
			Add notification
		</button> -->
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
			timers: [],
			options: {
				timeout: 3,
				fadeOutTime: 500,
				useTimeout: false
			}
		}
	},

	watch: {
		notifications(newNotifications, oldNotifications) {
			// TODO: After scrolling, maybe add an animation/effect on the newest added notification
			var newestNotification
			if (newNotifications.length > 0) newestNotification = newNotifications[0]
			else newestNotification = newNotifications.slice().sort((a, b) => new Date() - new Date(a.created))[0]

			if (this.options.useTimeout && newNotifications && newNotifications.length) {
				// Timeout to remove the notification
				let removeAfterSeconds = this.options.timeout * 1000
				setTimeout(() => this.removeNotificationById(newestNotification.id), removeAfterSeconds)
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
			el ? el.classList.remove('fade-in') : null
			el ? el.classList.add('fade-out') : null

			setTimeout(() => {
				this.$store.dispatch('removeNotification', id)
			}, this.options.fadeOutTime)
		},

		clearNotifications() {
			// Fade-out animation
			let domEls = this.$refs.notificationList.getElementsByTagName('li')
			for (var j = 0; j < domEls.length; j++) {
				domEls[j].classList.remove('fade-in')
				domEls[j].classList.add('fade-out')
			}

			// for (let i = 0; i <= this.notifications.length; i++) {
			// 	console.log(this.notifications[i])
			// 	if (this.notifications[i]) clearInterval(this.notifications[i].timeout)
			// }

			// Clear notifications from the state
			setTimeout(() => {
				this.$store.dispatch('clearNotifications')
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
		display: flex;
		flex-direction: column;
		position: fixed;
		right: 0;
		bottom: 0;
		
		max-height: 100vh;
		width: 450px;
		padding: 5px 0 8px 0;
		background-color: rgba(255, 255, 255, 0.7);
		border-radius: 10px;
		z-index: 9;

		ul {
			padding: 0 5px 5px 5px;
			margin: 0 0;
			overflow-y: auto;
			overflow-x: hidden;
			list-style: none;
		}

		.bottom-bar {
			padding-top: 5px;
			text-align: right;

			.btn-clear-all {
				padding: 5px;
				max-width: 50%;
				margin: 0 0 0 auto;
				padding: 3px 10px;
				border-radius: 5px;
				background-color: rgba(21, 80, 255, 0.9);
				color: #fff;
			}
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