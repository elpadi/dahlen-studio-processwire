class Motion extends EventEmitter {

	constructor(node) {
		super();
		this.node = node;
		node.id = node.dataset.name.split('/').join('--');
		let settings = node.dataset;
		this._slideshowInfo = window[node.dataset.name];
		this.imageCount = this._slideshowInfo.length;
		this.poster = node.querySelector('img');
		this.isInitialized = false;
		this.hasBufferLoaded = false;
		this.hasStarted = false;
		this.autoplay = ('autoplay' in settings) && settings.autoplay == 'true';
		this.baseUrl = "http://dahlenstudio.com" + window.app.config.ALBUMS_URL + settings.name;
		this.animation = new MotionAnimation(Motion.ANIMATION_EVENT_NAMES);
		node.addEventListener('click', this.onClick.bind(this));
		console.log('Motion.constructor', node.id);
	}

	setupImageCreate() {
		let t = parseInt(this.node.dataset.timing, 10);
		// createImage(defaultTiming, outerRect, index)
		this.createImage = Motion.prototype.createImage.bind(this, {
			delay: t,
			duration: t + 50,
			fadeDuration: t + 50
		}, Rect.createFromNode(this.node));
	}

	onPlayButtonClick() {
		console.log('Motion.onPlayButtonClick', this.node.id);
		if (!this.isInitialized) this.init();
		this.when('buffered').then(this.play.bind(this));
	}

	onClick(e) {
		if (e.target.classList.contains('play-button')) return this.onPlayButtonClick();
		if (this.node.classList.contains('playing')) return this.togglePlay();
	}

	onBufferLoaded() {
		console.log('Motion.onBufferLoaded');
		this.hasBufferLoaded = true;
		this.node.classList.add('buffered');
		this.trigger('buffered');
	}

	onImageLoaded(image, index) {
		//console.log('Motion.onImageLoaded', index);
		if (!this.hasBufferLoaded && index / this.imageCount > window.app.config.MOTION_BUFFER_SIZE) this.onBufferLoaded();
	}

	onImagesLoaded() {
		this.node.classList.remove('loading');
		this.trigger('loaded');
	}

	loadImages() {
		let loader = new ImageLoader(this._slideshowInfo.map(info => this.baseUrl + '/' + info.filename));
		loader.events.addEventListener('imageloaded', e => this.onImageLoaded(e.detail.image, e.detail.index));
		this.node.classList.add('loading');
		return loader.loadAll().then(_.bindKey(this, 'onImagesLoaded'));
	}

	finish() {
		this.node.classList.add('finished');
		this.node.classList.remove('playing');
		this.trigger('finished');
	}

	play() {
		console.log('Motion.play', 'autoplay: ', this.autoplay, this.node.id);
		if (this.hasStarted) return;
		this.hasStarted = true;
		console.log('Motion.play', _.cloneDeep(this.animation.keyFrames));
		this.node.classList.add('playing');
		this.trigger('started');
		app.music.play(this.node.dataset.name);
		this.resume();
	}

	pause() {
		this.trigger('paused');
		this.animation.pause();
	}

	resume() {
		this.trigger('resumed');
		this.animation.resume();
	}
	
	togglePlay() {
		return this.animation.isPaused ? this.resume() : this.pause();
	}

	remove() {
		console.log('Motion.remove', this.node.id);
		requestAnimationFrame(() => this.node.style.opacity = 0);
		return Promise.delay(Motion.CONTAINER_FADE_DURATION, () => this.node.classList.add('removed'));
	}

	addImageKeyFrames(image, index) {
		if (index == 0) {
			this.animation.addKeyFrame('hide', image.delay + image.duration, index);
			this.animation.addKeyFrame('remove', image.delay + image.fadeOutDuration, index);
		}
		else {
			let showTime = image.delay;
			let hideTime = showTime + image.fadeInDuration + image.duration;
			let removeTime = hideTime + image.fadeOutDuration;
			this.animation.addKeyFrame('show', showTime, index);
			this.animation.addKeyFrame('hide', hideTime , index);
			this.animation.addKeyFrame('remove', removeTime, index);
		}
	}

	createImage(defaultTiming, outerRect, index) {
		let info = this._slideshowInfo[index];
		let image = new MotionImage(this.baseUrl + '/' + info.filename);
		this.images[index] = image;
		image.parseInfo(defaultTiming, outerRect, info, index, index ? this.images[index - 1] : undefined);
		if (index == 0) {
			image.createImageNode();
			this.poster.style.cssText = image.node.getAttribute('style');
			image.node = this.poster;
		}
		this.addImageKeyFrames(image, index);
	}

	onShowAnimationTick(e) {
		let index = e.detail.value;
		if (index < 10) console.log('Motion.onShowAnimationTick', index)
		this.images[index].show(this.node);
	}

	onHideAnimationTick(e) {
		let index = e.detail.value;
		if (index < 10) console.log('Motion.onHideAnimationTick', index)
		if (index < this.imageCount - 1) this.images[index].hide();
	}

	onRemoveAnimationTick(e) {
		let index = e.detail.value;
		if (index < 10) console.log('Motion.onRemoveAnimationTick', index)
		if (index === this.imageCount - 1) this.finish();
		else {
			this.images[index].remove();
			delete this.images[index];
			delete this._slideshowInfo[index];
		}
	}

	init() {
		console.log("Motion.init", this.node.id);
		if (this.isInitialized) {
			console.error("Already initialized.", this.node.id);
			return;
		}
		for (let name of Motion.ANIMATION_EVENT_NAMES) {
			let fn = 'on' + _.capitalize(name) + 'AnimationTick';
			this.animation.on(name, _.bindKey(this, fn));
		}
		this.isInitialized = true;
		this.totalDelay = 0;
		this.images = [];
		this.loadImages();
		this.setupImageCreate();
		for (let i = 0; i < this._slideshowInfo.length; i++) this.createImage(i);
	}

}

Motion.ANIMATION_EVENT_NAMES = ['show','hide','remove'];
Motion.CONTAINER_FADE_DURATION = 4000;
Motion.LAST_IMAGE_DELAY = 1000;
Motion.AUTOPLAY_DELAY = 500;
