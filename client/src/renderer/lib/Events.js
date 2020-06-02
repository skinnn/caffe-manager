import { v4 as uuidv4 } from 'uuid'
import './typedefs'

// /**
// * Event to publish when app loads
// * ProducedBy: components/preload.js
// * ConsumedBy: App.vue, views/MainPanel.vue
// **/
// export class AppStartEvent {
// 	constructor() {
// 		// An event type with no arguments
// 	}
// }

/**
 * Event type for handling global application notices/notifications.
 * ProducedBy: components/preload.js
 * ConsumedBy: App.vue, views/MainPanel.vue
 **/
class GlobalNotificationEvent {
	/**
	 * @param	{GlobalNotification}	 notification				[Notification object]
	 * @param	{String}							 notification.text	[Text of the notification]
	 * @param	{String}							 notification.type 	[error, warning, success, info]
	 **/
	constructor(notification) {
		this.text = notification.text
		this.type = notification.type

		this.id = uuidv4()
	}
}

export { GlobalNotificationEvent }