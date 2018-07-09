class MotionAnimation extends EventEmitter {

	constructor(names) {
		super();
		this.keyFrames = {};
		for (let name of names) this.keyFrames[name] = [];
		this.timeElapsed = 0;
		this.isPaused = true;
	}

	addKeyFrame(name, time, value) {
		console.log('MotionAnimation.addKeyFrame', name, time, value);
		this.keyFrames[name].push({ time: time, value: value });
	}

	hasKeyFrames() {
		let names = Object.keys(this.keyFrames);
		let has = names.length && names.some(name => this.keyFrames[name].length);
		console.log('MotionAnimation.hasKeyFrames', has);
		return has;
	}

	onTick() {
		let newTickTime = Date.now();
		this.timeElapsed += (newTickTime - this.tickTime);
		for (let name in this.keyFrames) {
			let index = _.findIndex(this.keyFrames[name], frame => frame.time < this.timeElapsed);
			if (index >= 0) {
				let frame = this.keyFrames[name].splice(index, 1).shift();
				this.trigger(name, frame);
				if (this.keyFrames[name].length == 0) delete this.keyFrames[name];
				if (!this.hasKeyFrames()) this.pause();
			}
		}
		this.tickTime = newTickTime;
		if (!this.isPaused) this.tick();
	}

	pause() {
		this.isPaused = true;
	}

	tick() {
		requestAnimationFrame(this.onTick.bind(this));
	}

	resume() {
		console.log('MotionAnimation.resume');
		if (!this.isPaused) return false;
		this.tickTime = Date.now();
		this.isPaused = false;
		this.tick();
	}

}
