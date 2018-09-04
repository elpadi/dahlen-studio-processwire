!function(t){"use strict";function e(){this._head=null,this._tail=null,this._length=0}e.prototype._createNewNode=function(t){var e=this;return{data:t,next:null,prev:null,remove:function(){null!==this.prev&&(this.prev.next=this.next),null!==this.next&&(this.next.prev=this.prev),e._head===this&&(e._head=this.next),e._tail===this&&(e._tail=this.prev),e._length--},prepend:function(t){if(e._head===this)return e.prepend(t);var n=e._createNewNode(t);return n.prev=this.prev,n.next=this,this.prev.next=n,this.prev=n,e._length++,n},append:function(t){if(e._tail===this)return e.append(t);var n=e._createNewNode(t);return n.prev=this,n.next=this.next,this.next.prev=n,this.next=n,e._length++,n}}},e.prototype.append=function(t){var e=this._createNewNode(t);return 0===this._length?(this._head=e,this._tail=e):(this._tail.next=e,e.prev=this._tail,this._tail=e),this._length++,e},e.prototype.prepend=function(t){var e=this._createNewNode(t);return null===this._head?this.append(t):(this._head.prev=e,e.next=this._head,this._head=e,this._length++,e)},e.prototype.item=function(t){if(t>=0&&t<this._length){for(var e=this._head;t--;)e=e.next;return e}},e.prototype.head=function(){return this._head},e.prototype.tail=function(){return this._tail},e.prototype.size=function(){return this._length},e.prototype.remove=function(t){throw"Not implemented"},t.DoublyLinkedList=e}("undefined"==typeof exports?this.DLL={}:exports);
class Rect {

	constructor(w, h) {
		this.width = w;
		this.height = h;
		this.ratio = w / h;
	}

	/**
	 * Contain a rect inside the current rect.
	 */
	contain(rect) {
		let c = {};
		if (rect.ratio > this.ratio) {
			c.width = this.width;
			c.height = Math.round(this.width / rect.ratio);
		}
		else {
			c.width = Math.round(this.height * rect.ratio);
			c.height = this.height;
		}
		return Rect.createFromObject(c);
	}

	containBigger(rect) {
		let c = this.contain(rect);
		return c.width > rect.width || c.height > rect.height ? rect : c;
	}

}

Rect.createFromNode = function(node) {
	return new Rect(node.offsetWidth, node.offsetHeight);
};

Rect.createFromObject = function(obj) {
	return new Rect(obj.width, obj.height);
};
class AjaxLoader {
	
	constructor(baseUrl) {
		this.baseUrl = baseUrl;
		this.isBusy = false;
	}

	fetch() {
		if (this.isBusy) return Promise.reject("Must wait for the current page to finish.");
		this.isBusy = true;
		return window.fetch(this.getUrl()).then(this.onResponse.bind(this));
	}

	getUrl() {
		throw new Error("Method must be implemented by a subclass.");
	}

	onResponse(response) {
		return response.json();
	}

	done() {
		this.isBusy = false;
	}

	content() {
		return this.fetch();
	}

}
class ImageLoader extends EventEmitter {

	/**
	 * @param images array List of image names
	 */
	constructor(images) {
		super();
		this.images = images;
		this.chunkSize = 5;
		this.parallelCount = 0;
		this.loadedImages = [];
		this.isLoadingAll = false;
	}

	loadAll() {
		this.isLoadingAll = true;
		return new Promise((resolve, reject) => {
			this.loadChunk(resolve);
		}).then(count => this.trigger('all'));
	}

	loadChunk(resolveAll) {
		let begin = this.loadedImages.length;
		let end = begin + this.chunkSize, max = this.images.length;
		console.log('ImageLoader.loadChunk', begin, end, max);
		return Promise.all(
			_.range(begin, Math.min(end, max)).map(this.loadIndex.bind(this))
		).then(this.onChunkLoaded.bind(this, resolveAll));
	}

	onChunkLoaded(resolveAll) {
		console.log('ImageLoader.onChunkLoaded', this.loadedImages.length);
		this.trigger('chunkloaded');
		if (this.loadedImages.length == this.images.length) {
			resolveAll(this.loadedImages.length);
			this.isLoadingAll = false;
		}
		else {
			if (this.isLoadingAll) this.loadChunk(resolveAll);
		}
		return this.loadedImages.length;
	}

	onImageLoaded(index, img) {
		this.loadedImages.push(index);
		this.parallelCount--;
		console.log('ImageLoader.onImageLoaded', index, this.loadedImages.length);
		this.trigger('imageloaded', { image: img, index: index });
		return index;
	}

	loadImage(src) {
		if (this.parallelCount >= ImageLoader.MAX_PARALLEL_COUNT)
			return Promise.reject(new Error(`Cannot exceed ${ImageLoader.MAX_PARALLEL_COUNT} simultaneous loads.`));
		this.parallelCount++;
		return new Promise((resolve, reject) => {
			let img = new Image();
			let onload = () => {
				img.removeEventListener('load', onload);
				resolve(img);
			};
			img.addEventListener('load', onload);
			img.src = src;
		});
	}

	loadIndex(index) {
		console.log('ImageLoader.loadIndex', index);
		if (this.loadedImages.includes(index))
			return Promise.reject(new Error(`Image [${index}]${this.images[index]} was already loaded.`));
		return this.loadImage(this.images[index]).then(_.bindKey(this, 'onImageLoaded', index));
	}

}

ImageLoader.MAX_PARALLEL_COUNT = 5;
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
		if ('width' in initial) {
			let contained = outerRect.containBigger(Rect.createFromObject(initial));
			_.assign(this, contained);
		}
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
class MotionQueue {

	constructor(motions) {
		this.list = new DLL.DoublyLinkedList();
		for (let i = 0, l = motions.length; i < l; i++) {
			let m = motions[i];
			m.node.style.zIndex = l - i;
			this.list.append(m);
		}
	}

	setupRelays() {
		let item = this.list.head();
		while (item.next) {
			let cur = item.data;
			let next = item.next.data;
			this.setupRelay(cur, next);
			item = item.next;
		}
	}

	setupRelay(cur, next) {
		this.whenFinished(cur, next).then(this.start.bind(this, next));
	}

	start(item) {
		return this.startItem(item === undefined ? this.list.head().data : item);
	}

	startItem(item) {
		throw new Error("Method must be implemented by a subclass.");
	}

	whenFinished(cur, next) {
		throw new Error("Method must be implemented by a subclass.");
	}

	clone(constructor) {
		let items = [];
		for (let i = 0, l = this.list.size(); i < l; i++) {
			items.push(this.list.item(i).data);
		}
		return constructor(items);
	}

}

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
class MotionLoadingQueue extends MotionQueue {

	startItem(motion) {
		console.log('MotionLoadingQueue.startItem', motion.node.id);
		motion.init();
		return Promise.resolve(true);
	}

	whenFinished(cur, next) {
		console.log('MotionLoadingQueue.whenFinished', cur.node.id, next.node.id);
		return new Promise(resolve => cur.on('loaded', resolve));
	}

}
class MotionPlayingQueue extends MotionQueue {

	startItem(motion) {
		console.log('MotionPlayingQueue.startItem', motion.node.id);
		motion.node.style.opacity = 1;
		return Promise.delay(MotionPlayingQueue.TRANSITION_DELAY, _.bindKey(motion, 'onPlayButtonClick'));
	}

	whenFinished(cur, next) {
		return Promise.all([
			cur.when('finished').then(_.bindKey(cur, 'remove')),
			next.when('buffered')
		]);
	}

}

MotionPlayingQueue.TRANSITION_DELAY = 1000;
(function($, app) {

	app.init(function() {
		let motions = Array.from(document.querySelectorAll('.motion')).map(node => new Motion(node));
		app.loadingQueue = new MotionLoadingQueue(motions);
		app.loadingQueue.setupRelays();
		app.loadingQueue.start();
	});

})(jQuery, window.app);
