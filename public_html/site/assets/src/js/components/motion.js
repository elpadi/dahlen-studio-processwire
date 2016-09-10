var Motion = (function($) {
	
	return function Motion(dom_node) {
		this.promises = {}; this._resolvers = {};
		this.EVENT_NAMES = ['buffered','loaded','finished'];
		this.EVENT_NAMES.forEach(this._eventPromise.bind(this));
		
		console.log('Motion.constructor', dom_node.id);
		this.dom_node = dom_node;
		this._slideshowInfo = Motion.DEBUG ? window[dom_node.dataset.info].slice(0, Motion.DEBUG_IMG_COUNT) : window[dom_node.dataset.info];
		this.imageCount = this._slideshowInfo.length;
		this.poster = dom_node.getElementsByTagName('img')[0];
		this.isInitialized = false;

		this.sounds = JSON.parse(dom_node.dataset.music).map(function(name) { return ASSETS_URL + 'slideshows/' + dom_node.dataset.name + '/' + name; });
		this.autoplay = ('autoplay' in dom_node.dataset) && dom_node.dataset.autoplay === 'true';

		this.isPaused = false;
	
		if (!('position' in this._slideshowInfo[0])) this._setInfoDefaults();
		$(dom_node).on('click', function() { if (dom_node.classList.contains('playing')) this.togglePlay(); }.bind(this))
			.on('click', '.play-button', this.onPlayButtonClick.bind(this));
	};

})(jQuery);

Motion.DEBUG = false;
Motion.DEBUG_IMG_COUNT = 10;
Motion.CONTAINER_FADE_DURATION = 4000;
Motion.LAST_IMAGE_DELAY = 1000;
Motion.AUTOPLAY_DELAY = 500;

(function() {
	var contain = function(inner, outer) {
		var c = {};
		inner.r = inner.w / inner.h;
		outer.r = outer.w / outer.h;
		if (inner.r > outer.r) {
			c.w = outer.w;
			c.h = Math.round(outer.w / inner.r);
		}
		else {
			c.w = Math.round(outer.h * inner.r);
			c.h = outer.h;
		}
		return c.w > inner.w || c.h > inner.h ? inner : c;
	};

	Object.defineProperty(Motion.prototype, '_setInfoDefaults', {
		value: function() {
			var t = parseInt(this.dom_node.dataset.timing, 10), w = this.dom_node.offsetWidth, h = this.dom_node.offsetHeight, durations = [1000,700,500,400];
			this._slideshowInfo.forEach(function(imageInfo, index) {
				var dims = (imageInfo.width > w || imageInfo.height > h) ? contain({ w: imageInfo.width, h: imageInfo.height }, { w: w, h: h }) : { w: imageInfo.width, h: imageInfo.height };
				imageInfo.size = [dims.w, dims.h];
				imageInfo.position = [-1, -1];
				imageInfo.fade = [t,t];
				imageInfo.delay = index < durations.length && index > 0 ? this._slideshowInfo[index - 1].delay + durations[index] : 0;
				imageInfo.duration = index < durations.length ? durations[index] : t + 50;
			}.bind(this));
		}
	});

	Object.defineProperty(Motion.prototype, '_eventPromise', {
		value: function(name) {
			this.promises[name] = new Promise(function(resolve, reject) {
				this._resolvers[name] = resolve;
			}.bind(this));
		}
	});

	Object.defineProperty(Motion.prototype, '_resolve', {
		value: function(name) {
			return this._resolvers[name](this);
		}
	});

	Object.defineProperty(Motion.prototype, '_createImages', {
		value: function() {
			this._slideshowInfo.forEach(function(imageInfo) {
				var img = new Image();
				if (imageInfo.position[0] >= 0) {
					img.style.left = imageInfo.position[0] + 'px';
					img.style.top = imageInfo.position[1] + 'px';
					img.style.margin = '0';
				}
				if ('size' in imageInfo) {
					img.style.width = imageInfo.size[0] + 'px';
					img.style.height = imageInfo.size[1] + 'px';
				}
				img.style.transition = img.style.WebkitTransition = img.style.MozTransition = 'opacity ' + imageInfo.fade[0] + 'ms';
				imageInfo.img = img;
			}.bind(this));
		}
	});

	Object.defineProperty(Motion.prototype, '_loadSingle', {
		value: function(index, onLoad) {
			this._slideshowInfo[index].img.addEventListener('load', onLoad.bind(this));
			this._slideshowInfo[index].img.src = window.ALBUMS_URL + this.dom_node.dataset.name + '/' + this._slideshowInfo[index].filename;
		}
	});

	Object.defineProperty(Motion.prototype, '_loadImages', {
		value: function(onProgress) {
			var loadedCount = 0, index = 0;
			var loadNext = function() {
				if (index < this.imageCount) this._loadSingle(index, function(e) {
					loadedCount++;
					onProgress(100 * loadedCount / this.imageCount);
					if (index < this.imageCount) loadNext();
				});
				index++;
			}.bind(this);
			for (var i = 0; i < 5; i++) loadNext();
		}
	});

	Object.defineProperty(Motion.prototype, '_load', {
		value: function() {
			var markers = { buffered: parseInt(this.dom_node.dataset.start, 10), loaded: 100 };
			var reached = Object.keys(markers).map(function() { return false; });
			this._loadImages(function(progress) {
				Object.keys(markers).forEach(function(key, index) {
					if (!reached[index] && progress >= markers[key]) {
						reached[index] = true;
						this._resolve(key);
					}
				}.bind(this));
			}.bind(this));
			this.dom_node.classList.add('loading');
		}
	});

	Object.defineProperty(Motion.prototype, 'initList', {
		value: function(list_node, index) {
			this.list_node = list_node;
			if (Motion.list.autoload) index > 0 ? this.addToLoadingQueue() : this.init();
			if (this.autoplay) index > 0 ? this.addToPlayingQueue() : this.getPromise('buffered').then(this.play.bind(this));
		}
	});

	Object.defineProperty(Motion.prototype, 'onPlayButtonClick', {
		value: function() {
			console.log('Motion.onPlayButtonClick', this.dom_node.id);
			if (!this.isInitialized) this.init();
			this.getPromise('buffered').then(this.play.bind(this));
		}
	});

	Object.defineProperty(Motion.prototype, 'addToLoadingQueue', {
		value: function() {
			console.log('Motion.addToLoadingQueue', this.dom_node.id);
			this.list_node.prev.data.getPromise('loaded').then(this.init.bind(this));
		}
	});

	Object.defineProperty(Motion.prototype, 'addToPlayingQueue', {
		value: function() {
			console.log('Motion.addToPlayingQueue', this.dom_node.id);
			Promise.all([
				this.list_node.prev ? this.list_node.prev.data.getPromise('finished') : Promise.resolve(),
				this.getPromise('buffered')
			]).then(this.next.bind(this));
		}
	});

	Object.defineProperty(Motion.prototype, 'init', {
		value: function() {
			console.log('Motion.init', this.dom_node.id);
			if (this.isInitialized) return;
			this.isInitialized = true;
			this._createImages();
			this._load();
			this.getPromise('loaded').then(function() { this.dom_node.classList.remove('loading'); }.bind(this));
		}
	});

	Object.defineProperty(Motion.prototype, 'getPromise', {
		value: function(name) {
			return this.promises[name];
		}
	});

	Object.defineProperty(Motion.prototype, 'remove', {
		value: function(name) {
			console.log('Motion.remove', this.dom_node.id);
			this.dom_node.classList.remove('current');
			requestAnimationFrame(function() { this.dom_node.style.opacity = 0; }.bind(this), Motion.LAST_IMAGE_DELAY);
		}
	});

	Object.defineProperty(Motion.prototype, 'next', {
		value: function(name) {
			console.log('Motion.next', this.dom_node.id);
			var delay = Motion.AUTOPLAY_DELAY;
			if (this.list_node.prev) {
				this.list_node.prev.data.remove();
				delay += Motion.CONTAINER_FADE_DURATION;
			}
			this.dom_node.classList.add('current');		
			setTimeout(function() { this.dom_node.style.opacity = 1; }.bind(this), delay);
			if (this.autoplay) setTimeout(this.play.bind(this), delay + Motion.CONTAINER_FADE_DURATION);
		}
	});

	Object.defineProperty(Motion.prototype, '_onShowTick', {
		value: function(index) {
			var img = this._slideshowInfo[index].img;
			this.dom_node.appendChild(img);
			requestAnimationFrame(function() { img.style.opacity = '1'; });
		}
	});

	Object.defineProperty(Motion.prototype, '_onHideTick', {
		value: function(index) {
			if (index === 1) this.poster.remove();
			if (index === this.imageCount - 1) return;
			var img = this._slideshowInfo[index].img;
			img.style.transition = img.style.WebkitTransition = img.style.MozTransition = 'opacity ' + this._slideshowInfo[index].fade[1] + 'ms';
			requestAnimationFrame(function() { img.style.opacity = '0'; });
		}
	});

	Object.defineProperty(Motion.prototype, '_onRemoveTick', {
		value: function(index) {
			if (index === this.imageCount - 1) return this.finished();
			this._slideshowInfo[index].img.remove();
			delete this._slideshowInfo[index];
		}
	});

	Object.defineProperty(Motion.prototype, '_onTick', {
		value: function() {
			var animationTime = Date.now() - (this.animationStart + this.animationPauseOffset), total = 0;
			['show','hide','remove'].filter(function(key) {
				return this.animationDelays[key].length;
			}.bind(this)).forEach(function(key) {
				var delays = this.animationDelays[key];
				total += delays.length;
				while (delays.length && delays[0].delay < animationTime) {
					this['_on' + key[0].toUpperCase() + key.substr(1) + 'Tick'].call(this, delays.shift().index);
				}
			}.bind(this));
			if (total && !this.isPaused) requestAnimationFrame(this._onTick.bind(this));
		}
	});

	Object.defineProperty(Motion.prototype, '_computeAnimationDelays', {
		value: function() {
			var lastDelay = 0, defaultTiming = parseInt(this.dom_node.dataset.timing, 10),
					animationDelays = { show: [], hide: [], remove: [] };
			this._slideshowInfo.forEach(function(imageInfo, index) {
				if (imageInfo.delay === 0) imageInfo.delay = lastDelay + defaultTiming;
				if (imageInfo.duration === 0) imageInfo.duration = defaultTiming + 100;
				animationDelays.show.push({ delay: imageInfo.delay, index: index });
				animationDelays.hide.push({ delay: imageInfo.delay + imageInfo.duration + imageInfo.fade[0], index: index });
				animationDelays.remove.push({ delay: imageInfo.delay + imageInfo.duration + imageInfo.fade[0] + imageInfo.fade[1] + 100, index: index });
				lastDelay = imageInfo.delay;
			});
			['show','hide','remove'].forEach(function(key) {
				animationDelays[key].sort(function(a, b) { return a.delay - b.delay; });
			});
			this.animationDelays = animationDelays;
		}
	});

	Object.defineProperty(Motion.prototype, 'finished', {
		value: function() {
			this.dom_node.classList.add('finished');
			this.dom_node.classList.remove('playing');
			this._resolve('finished');
			if (Motion.list.size() === 1) Music.stop();
		}
	});

	Object.defineProperty(Motion.prototype, 'pause', {
		value: function() {
			this.isPaused = true;
			this.animationPauseOffset += (Date.now() - this.animationStart);
		}
	});

	Object.defineProperty(Motion.prototype, 'resume', {
		value: function() {
			if (!this.isPaused) return;
			this.isPaused = false;
			this.animationStart = Date.now();
			requestAnimationFrame(this._onTick.bind(this));
		}
	});

	Object.defineProperty(Motion.prototype, 'togglePlay', {
		value: function() {
			return this.isPaused ? this.resume() : this.pause();
		}
	});

	Object.defineProperty(Motion.prototype, 'play', {
		value: function() {
			console.log('Motion.play', 'autoplay', this.autoplay, this.dom_node.id);
			this._computeAnimationDelays();
			this.animationPauseOffset = 0;
			this.animationStart = Date.now();
			requestAnimationFrame(this._onTick.bind(this));
			this.dom_node.classList.add('buffered');
			this.dom_node.classList.add('playing');
			setTimeout(function() { Music.play(this.sounds); }.bind(this), parseInt(this.dom_node.dataset.musicDelay, 10));
		}
	});

})();

(function($) {

	Motion.list = new DLL.DoublyLinkedList();
	$(document).ready(function() {
		// allow time for the resize trigger
		setTimeout(function() {
			var $slideshows = $('.motion');
			$slideshows.first().addClass('current');
			Motion.list.autoload = document.body.classList.contains('template--home');
			$slideshows.each(function(i, el) {
				var motion = new Motion(el);
				motion.initList(Motion.list.append(motion), i);
			});
			if (document.body.classList.contains('template--home')) window.runIntro();
		}, 200);
	});

})(jQuery);

