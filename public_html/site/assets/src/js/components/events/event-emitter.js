class EventEmitter {

	constructor() {
		this.events = new EventTarget();
		this.triggeredEvents = [];
	}

	on() {
		this.events.addEventListener.apply(this.events, arguments);
	}

	when(name) {
		return this.hasTriggered(name)
			? Promise.resolve(true)
			: new Promise((resolve, reject) => {
				this.on(name, resolve);
			})
	}

	hasTriggered(name) {
		return this.triggeredEvents.indexOf(name) != -1;
	}

	trigger(name, data) {
		console.log('EventEmitter.trigger', name, data);
		if (data == undefined) data = {};
		this.events.dispatchEvent(new CustomEvent(name, { detail: data }));
		if (!this.hasTriggered(name)) this.triggeredEvents.push(name);
	}

}
