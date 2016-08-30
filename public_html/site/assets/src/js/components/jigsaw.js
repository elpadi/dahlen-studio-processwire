(function($) {

	Object.defineProperty(Array.prototype, 'shuffle', {
		value: function() {
			var i = 0, j = 0, temp = null;
			for (i = this.length - 1; i > 0; i -= 1) {
				j = Math.floor(Math.random() * (i + 1))
				temp = this[i]
				this[i] = this[j]
				this[j] = temp
			}
			return this;
		}
	});

	Object.defineProperty(Function.prototype, 'curry', {
		value: function(...saved) {
			var fn = this;
			return function() {
				return fn.apply(this, saved.concat(Array.from(arguments)));
			};
		}
	});

	var loadPiece = function(url, name) {
		var img = new Image(), pos = name.replace(/piece-(.*)\.png/, '$1').split('x');
		img.className = 'jsimg piece';
		img.style.left = pos[0] + 'px';
		img.style.top = pos[1] + 'px';
		return new Promise(function(resolve, reject) {
			img.addEventListener('load', function(e) { resolve(img); });
			img.src = url + '/' + name;
		});
	};

	
	var Easing = {
		linear: function(t, b, c, d) {
			return b + (t / d) * c;
		},
		cubicEaseOut: function(timeElapsed, initialValue, valueChange, duration) {
			var time_ratio = (timeElapsed / duration) - 1;
			return (valueChange * (( time_ratio * time_ratio * time_ratio ) + 1)) + initialValue;
		}
	};

	var nextPiece = function(onEnd, container, images, count, timeout) {
		if (!images.length) return onEnd();
		var img = images.pop();
		container.appendChild(img);
		setTimeout(function() { nextPiece(onEnd, container, images, count, timeout); }, Easing.cubicEaseOut(count - images.length, timeout, 50 - timeout, count));
	};

	$(document).ready(function() {
		$('.jigsaw').each(function(i, el) {
			var pieces = this.dataset.pieces.split(',').shuffle();
			var loaders = pieces.map(loadPiece.curry(this.dataset.url));
			this.classList.add('loading');
			Music.play(JSON.parse(this.dataset.music).map(function(name) { return this.dataset.url + '/' + name; }.bind(this)));
			Promise.all(loaders).then(function(images) {
				var endPieces = new Promise(function(resolve, reject) {
					el.classList.remove('loading');
					nextPiece(resolve, el, images, images.length, 500);
				});
				endPieces.then(function() {
					var latters = el.dataset.afterPieces.split(',');
					latters.forEach(function(id, index) {
						var img = new Image();
						img.className = 'jsimg anim';
						img.style.zIndex = index + 2;
						el.appendChild(img);
						setTimeout(function() {
							img.src = document.getElementById(id).src;
							img.classList.add('visible');
						}, parseInt(document.getElementById(id).dataset.delay, 10) * 1000);
					});
					setTimeout(Music.stop, Math.max.apply(window, latters.map(function(id) { return parseInt(document.getElementById(id).dataset.delay, 10); })) * 1000);
				});
			});
		});
	});
})(jQuery);
