class EventQueue {

	constructor(queue) {
		this.queue = queue === undefined ? [] : queue;
		this.hasEventFired = false;
		this.attachEventHandler();
	}

	add(fn) {
		if (this.hasEventFired) fn();
		else this.queue.push(fn);
	}

	runQueue() {
		let fn;
		while (fn = this.queue.shift()) fn();
		this.hasEventFired = true;
	}

}
