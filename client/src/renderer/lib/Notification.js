import { v4 as uuidv4 } from 'uuid'
import './typedefs'

/** 
 * Class type for handling global application notifications.	
 * Produced by: store/modules/notifications.js	
 * Consumed by: App.vue
 **/
export default class Notification {
	/**
	 * @param	{AppNotification}	 	notification
	 * @param	{String}	 					notification.text						[Notification text]
	 * @param	{String}	 					notification.type						[error, warning, success, info]
	 * @param	{String}	 					notification.owner					[ID of the notification owner/user]
	 * @param	{String}	 					notification.shouldTimeout	[Should notification be removed after some time, default is true]
	 * @param	{Number}	 					notification.timeout				[For how many seconds it should be removed, default is 4]
	 **/

	constructor(notification) {
		this.text = notification.text || ''
		this.type = notification.type || 'info'
		this.owner = notification.owner || ''
		this.shouldTimeout = notification.shouldTimeout || true
		this.timeout = notification.timeout || 5

		// Appended props
		this.id = uuidv4()
		this.created = new Date().toISOString()
	}
}