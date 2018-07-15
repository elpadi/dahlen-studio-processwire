class MotionImage {

	constructor(url) {
		this.url = url;
		this.hasLoaded = false;
	}

	parseInfo(defaultTiming, outerRect, initial, index, prevImage) {
		let initialDurations = MotionImage.INITIAL_DURATIONS;
		// position
		if ('position' in initial) {
			this.left = initial.position[0];
			this.top = initial.position[1];
		}
		// size
		let contained = outerRect.containBigger(Rect.createFromObject(initial));
		_.assign(this, contained);
		// fade duration
		if ('fade' in initial) {
			this.fadeInDuration = initial.fade[0] ? initial.fade[0] : defaultTiming.fadeDuration;
			this.fadeOutDuration = initial.fade[1] ? initial.fade[1] : defaultTiming.fadeDuration;
		}
		else {
			this.fadeInDuration = this.fadeOutDuration = defaultTiming.fadeDuration;
		}
		// visible duration
		if ('duration' in initial) {
			this.duration = initial.duration ? initial.duration : defaultTiming.duration;
		}
		else {
			this.duration = index < initialDurations.length ? initialDurations[index] : defaultTiming.duration;
		}
		// delay before next image
		if ('delay' in initial) {
			this.delay = initial.delay ? initial.delay : prevImage.delay + defaultTiming.delay;
		}
		else {
			this.delay = index < initialDurations.length - 1 ? initialDurations[index + 1] - 100 : prevImage.delay + defaultTiming.delay;
		}
	}

	createImageNode() {
		let img = new Image();
		let css = img.style;
		img.src = this.url;
		for (let prop of ['left','top','width','height'])
			if (prop in this) css[prop] = this[prop] + 'px';
		if ('left' in this) css.margin = 0;
		this.node = img;
	}

	fade(opacity, duration) {
		let css = this.node.style;
		css.transition = 'opacity ' + duration + 'ms';
		requestAnimationFrame(() => css.opacity = opacity);
	}

	fadeIn() {
		this.fade(1, this.fadeInDuration);
	}

	fadeOut() {
		this.fade(0, this.fadeOutDuration);
	}

	show(parentNode) {
		this.createImageNode();
		parentNode.appendChild(this.node);
		this.fadeIn();
	}

	hide() {
		this.fadeOut();
	}

	remove() {
		this.node.remove();
	}

}

MotionImage.INITIAL_DURATIONS = [1000,700,500,400];
