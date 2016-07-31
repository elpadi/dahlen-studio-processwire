(function($) {

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
		return c;
	};

	var center = function(inner, outer) {
		return {
			x: Math.round((outer.w - inner.w) / 2),
			y: Math.round((outer.h - inner.h) / 2)
		};
	};

	var setInfoDefaults = function(slideshowInfo, container) {
		var t = parseInt(container.dataset.timing, 10), w = container.offsetWidth, h = container.offsetHeight, durations = [1000,700,500,400];
		slideshowInfo.forEach(function(imageInfo, index) {
			var dims = (imageInfo.width > w || imageInfo.height > h) ? contain({ w: imageInfo.width, h: imageInfo.height }, { w: w, h: h }) : { w: imageInfo.width, h: imageInfo.height };
			var pos = center(dims, { w: w, h: h });
			imageInfo.size = [dims.w, dims.h];
			imageInfo.position = [pos.x, pos.y];
			imageInfo.fade = [t,t];
			imageInfo.delay = index < durations.length && index > 0 ? slideshowInfo[index - 1].delay + durations[index] : 0;
			imageInfo.duration = index < durations.length ? durations[index] : t + 50;
		});
	};

	var loadSingle = function(path, imageInfo, onLoad) {
		imageInfo.img.addEventListener('load', onLoad);
		imageInfo.img.src = path + '/' + imageInfo.filename;
	};

	var load = function(path, slideshowInfo, onProgress) {
		var count = slideshowInfo.length, loadedCount = 0, index = 0;
		var loadNext = function() {
			if (index < count) loadSingle(path, slideshowInfo[index], function(e) {
				loadedCount++;
				onProgress(100 * loadedCount / count);
				if (index < count) loadNext();
			});
			index++;
		};
		for (var i = 0; i < 5; i++) loadNext();
	};

	var play = function(slideshowInfo, defaultTiming) {
		var lastDelay = 0;
		slideshowInfo.forEach(function(imageInfo, index) {
			var img = imageInfo.img;
			if (imageInfo.delay === 0) imageInfo.delay = lastDelay + defaultTiming;
			if (imageInfo.duration === 0) imageInfo.duration = defaultTiming;
			setTimeout(function() {
				img.style.opacity = 1;
				setTimeout(function() {
					img.style.transition = 'opacity ' + imageInfo.fade[1] + 'ms';
					requestAnimationFrame(function() { img.style.opacity = 0; });
					setTimeout(function() { img.remove(); delete slideshowInfo[index]; }, imageInfo.fade[1] + 100);
				}, imageInfo.duration + imageInfo.fade[0]);
			}, imageInfo.delay);
			lastDelay = imageInfo.delay;
		});
	};

	var createImages = function(container, slideshowInfo) {
		slideshowInfo.forEach(function(imageInfo) {
			var img = new Image();
			img.style.left = imageInfo.position[0] + 'px';
			img.style.top = imageInfo.position[1] + 'px';
			if ('size' in imageInfo) {
				img.style.width = imageInfo.size[0] + 'px';
				img.style.height = imageInfo.size[1] + 'px';
			}
			img.style.transition = 'opacity ' + imageInfo.fade[0] + 'ms';
			container.appendChild(img);
			imageInfo.img = img;
		});
	};

	$(document).ready(function() {
		$('.motion').each(function(i, el) {
			this.classList.add('init');
			this.classList.add('loading');
			var slideshowInfo = window[this.dataset.info], playing = false, start = parseInt(this.dataset.start, 10);
			if (!('position' in slideshowInfo[0])) setInfoDefaults(slideshowInfo, this);
			createImages(this, slideshowInfo);
			load(window[this.dataset.location] + this.id, slideshowInfo, function(progress) {
				if (!playing && progress > start) {
					playing = true;
					play(slideshowInfo, parseInt(el.dataset.timing, 10));
				}
			});
		});
	});
})(jQuery);
