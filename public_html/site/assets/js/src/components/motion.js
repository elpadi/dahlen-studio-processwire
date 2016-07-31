(function($) {

	var loadSingle = function(name, imageInfo, onLoad) {
		imageInfo.img.addEventListener('load', onLoad);
		imageInfo.img.src = window.ASSETS_URL + name + '/' + imageInfo.filename;
	};

	var load = function(name, slideshowInfo, onProgress) {
		var count = slideshowInfo.length, loadedCount = 0, index = 0;
		var loadNext = function() {
			loadSingle(name, slideshowInfo[index], function(e) {
				loadedCount++;
				onProgress(100 * loadedCount / count);
				if (loadedCount < count) loadNext();
			});
			index++;
		};
		for (var i = 0; i < 5; i++) loadNext();
	};

	var play = function(slideshowInfo, defaultTiming) {
		var lastDelay = 0;
		slideshowInfo.forEach(function(imageInfo) {
			var img = imageInfo.img;
			if (imageInfo.delay === 0) imageInfo.delay = lastDelay + defaultTiming;
			if (imageInfo.duration === 0) imageInfo.duration = defaultTiming;
			setTimeout(function() {
				img.style.opacity = 1;
				setTimeout(function() {
					img.style.transition = 'opacity ' + imageInfo.fade[1] + 'ms';
					requestAnimationFrame(function() { img.style.opacity = 0; });
					setTimeout(function() { img.remove(); imageInfo = null; }, imageInfo.fade[1] + 100);
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
			createImages(this, slideshowInfo);
			load(this.id, slideshowInfo, function(progress) {
				if (!playing && progress > start) {
					playing = true;
					play(slideshowInfo, parseInt(el.dataset.timing, 10));
				}
			});
		});
	});
})(jQuery);
