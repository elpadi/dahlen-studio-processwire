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
		// createImage(defaultTiming, outerRect, initialDurations, index)
		this.createImage = Motion.prototype.createImage.bind(this, {
			delay: t,
			duration: t + 50,
			fadeDuration: t + 50
		}, Rect.createFromNode(this.node), [1000,700,500,400]);
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
		console.log('Motion.onImageLoaded', index);
		if (!this.hasBufferLoaded && index / this.imageCount > 0.5) this.onBufferLoaded();
	}

	onImagesLoaded() {
		this.node.classList.remove('loading');
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
		this.node.classList.add('playing');
		this.trigger('started');
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
		this.node.classList.remove('current');
		requestAnimationFrame(() => this.node.style.opacity = 0);
	}

	addImageKeyFrames(image, index) {
		let showTime = this.totalDelay;
		let hideTime = showTime + image.fadeInDuration + image.duration;
		let removeTime = hideTime + image.fadeOutDuration;
		this.animation.addKeyFrame('show', showTime, index);
		this.animation.addKeyFrame('hide', hideTime , index);
		this.animation.addKeyFrame('remove', removeTime, index);
		this.totalDelay += image.delay;
	}

	createImage(defaultTiming, outerRect, initialDurations, index) {
		let info = this._slideshowInfo[index];
		let image = new MotionImage(this.baseUrl + '/' + info.filename);
		image.parseInfo(defaultTiming, outerRect, initialDurations, info, index);
		this.images[index] = image;
		this.addImageKeyFrames(image, index);
	}

	onShowAnimationTick(e) {
		let index = e.detail.value;
		console.log('Motion.onShowAnimationTick', index)
		this.images[index].show(this.node);
	}

	onHideAnimationTick(e) {
		let index = e.detail.value;
		console.log('Motion.onHideAnimationTick', index)
		if (index < this.imageCount - 1) this.images[index].hide();
	}

	onRemoveAnimationTick(e) {
		let index = e.detail.value;
		console.log('Motion.onRemoveAnimationTick', index)
		if (index === this.imageCount - 1) this.finish();
		else {
			this.images[index].remove();
			delete this.images[index];
			delete this._slideshowInfo[index];
		}
	}

	init() {
		console.error("Motion.init", "Already initialized.", this.node.id);
		if (this.isInitialized) return;
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
Motion.CONTAINER_FADE_DURATION = 1000;
Motion.LAST_IMAGE_DELAY = 1000;
Motion.AUTOPLAY_DELAY = 500;
