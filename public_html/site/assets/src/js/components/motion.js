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

		if (!('position' in this._slideshowInfo[0])) this._setInfoDefaults();
		$(dom_node).on('click', '.play-button', this.onPlayButtonClick.bind(this));
	};

})(jQuery);

Motion.DEBUG = false;
Motion.DEBUG_IMG_COUNT = 10;
Motion.CONTAINER_FADE_DURATION = 3000;
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
				img.style.transition = 'opacity ' + imageInfo.fade[0] + 'ms';
				this.dom_node.appendChild(img);
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

	Object.defineProperty(Motion.prototype, '_onImageChange', {
		value: function(index) {
			if (index === 1) this.poster.remove();
			if (index === this.imageCount - 1) {
				this.dom_node.classList.add('finished');
				this.dom_node.classList.remove('playing');
				this._resolve('finished');
				if (Motion.list.size() === 1) Music.stop();
			}
		}
	});

	Object.defineProperty(Motion.prototype, '_removeImage', {
		value: function(index) {
			var imageInfo = this._slideshowInfo[index], slideshowInfo = this._slideshowInfo;
			return new Promise(function(resolve, reject) {
				imageInfo.removeTimeoutId = setTimeout(function() {
					imageInfo.img.remove();
					delete slideshowInfo[index];
					resolve(index);
				}, imageInfo.fade[1] + 100);
			});
		}
	});

	Object.defineProperty(Motion.prototype, '_hideImage', {
		value: function(index) {
			var imageInfo = this._slideshowInfo[index];
			return new Promise(function(resolve, reject) {
				imageInfo.hideTimeoutId = setTimeout(function() {
					var img = imageInfo.img;
					img.style.transition = 'opacity ' + imageInfo.fade[1] + 'ms';
					requestAnimationFrame(function() { img.style.opacity = 0; });
					resolve(index);
				}, imageInfo.duration + imageInfo.fade[0]);
			});
		}
	});

	Object.defineProperty(Motion.prototype, '_showImage', {
		value: function(index) {
			var imageInfo = this._slideshowInfo[index];
			return new Promise(function(resolve, reject) {
				imageInfo.showTimeoutId = setTimeout(function() {
					imageInfo.img.style.opacity = 1;
					resolve(index);
				}, imageInfo.delay);
			});
		}
	});

	Object.defineProperty(Motion.prototype, 'initList', {
		value: function(list_node) {
			this.list_node = list_node;
			if (Motion.list.autoload) this.list_node.prev ? this.addToLoadingQueue() : this.init();
			if (Motion.list.autoplay) this.list_node.prev ? this.addToPlayingQueue() : this.getPromise('buffered').then(this.play.bind(this));
		}
	});

	Object.defineProperty(Motion.prototype, 'onPlayButtonClick', {
		value: function() {
			return this.isInitialized ? this.play() : (this.init(), this.getPromise('buffered').then(this.play.bind(this)));
		}
	});

	Object.defineProperty(Motion.prototype, 'addToLoadingQueue', {
		value: function() {
			this.list_node.prev.data.getPromise('loaded').then(this.init.bind(this));
		}
	});

	Object.defineProperty(Motion.prototype, 'addToPlayingQueue', {
		value: function() {
			Promise.all([
				this.list_node.prev ? this.list_node.prev.data.getPromise('finished') : Promise.resolve(),
				this.getPromise('buffered')
			]).then(this.next.bind(this));
		}
	});

	Object.defineProperty(Motion.prototype, 'init', {
		value: function() {
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
			this.dom_node.classList.remove('current');
			setTimeout(function() { this.dom_node.style.opacity = 0; }.bind(this), Motion.LAST_IMAGE_DELAY);
		}
	});

	Object.defineProperty(Motion.prototype, 'next', {
		value: function(name) {
			var prevDelay = 0;
			if (this.list_node.prev) {
				this.list_node.prev.data.remove();
				prevDelay += Motion.CONTAINER_FADE_DURATION + Motion.LAST_IMAGE_DELAY + Motion.AUTOPLAY_DELAY;
			}
			this.dom_node.classList.add('current');		
			setTimeout(function() { this.dom_node.style.opacity = 1; }.bind(this), prevDelay);
			setTimeout(this.play.bind(this), prevDelay + Motion.CONTAINER_FADE_DURATION);
		}
	});

	Object.defineProperty(Motion.prototype, 'play', {
		value: function() {
			var lastDelay = 0, defaultTiming = parseInt(this.dom_node.dataset.timing, 10);
			this._slideshowInfo.forEach(function(imageInfo, index) {
				if (imageInfo.delay === 0) imageInfo.delay = lastDelay + defaultTiming;
				if (imageInfo.duration === 0) imageInfo.duration = defaultTiming + 100;

				if (Motion.DEBUG) {
					this._showImage(index);
				}
				else {
					if (index < this.imageCount - 1)
						this._showImage(index)
							.then(this._hideImage.bind(this))
							.then(this._removeImage.bind(this))
							.then(this._onImageChange.bind(this));
					else this._showImage(index).then(this._onImageChange.bind(this));
				}

				lastDelay = imageInfo.delay;
			}.bind(this));
			this.dom_node.classList.add('buffered');
			this.dom_node.classList.add('playing');
			Music.play(this.sounds);
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
			Motion.list.autoplay = false;
			Motion.list.autoload = document.body.classList.contains('template--home');
			$slideshows.each(function(i, el) {
				var motion = new Motion(el);
				motion.initList(Motion.list.append(motion));
			});
		}, 50);
	});

})(jQuery);
