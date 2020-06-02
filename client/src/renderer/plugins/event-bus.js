export default {

	$eventBus: null,

	install(Vue, options) {
		this.$eventBus = new Vue()
	},

	listen(eventClass, handler) {
		this.$eventBus.$on(eventClass.name, handler)
	},

	listenOnce(eventClass, handler) {
		this.$eventBus.$once(eventClass.name, handler)
	},

	remove(eventClass, handler) {
		if (handler) {
			this.$eventBus.$off(eventClass.name, handler)
		} else {
			this.$eventBus.$off(eventClass.name)
		}
	},

	removeAll() {
		this.$eventBus.$off()
	},

	publish(event) {
		this.$eventBus.$emit(event.constructor.name, event)
	}

}