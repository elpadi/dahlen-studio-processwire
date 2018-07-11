class TimeoutEventEmitter extends EventEmitter {

	constructor(name, duration) {
		this.name = name;
		this.duration = duration;
		this.timeoutId = 0;
	}

	onTimeout() {
		this.timeoutId = 0;
		this.trigger(this.name);
	}

	clear() {
		clearTimeout(this.timeoutId);
		this.timeoutId = 0;
	}

	reset() {
		if (this.timeoutId) this.clear();
		this.timeoutId = window.setTimeout(this.onTimeout.bind(this), this.duration);
	}

}
