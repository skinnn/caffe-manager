import { v4 as uuidv4 } from 'uuid'
import './typedefs'

class Notification {
	/**
	 * Class type for handling global application notices/notifications.	
	 * Produced by: store/modules/notifications.js	
	 * Consumed by: App.vue
	 * @param	{AppNotification}	 notification
	 **/

	constructor(notification) {
		this.text = notification.text || ''
		this.type = notification.type || 'info'
		this.owner = notification.owner || ''

		// Appended props
		this.id = uuidv4()
		this.created = new Date().toISOString()
	}
}

export { Notification }