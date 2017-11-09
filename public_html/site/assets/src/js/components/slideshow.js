(function() {
	var imageProto = (new Image()).constructor.prototype;
	if ('hasLoaded' in imageProto) return;
	Object.defineProperty(imageProto, 'hasLoaded', {
		value: function hasLoaded() {
			return this.complete && this.naturalWidth > 1 && this.naturalHeight > 1;
		}
	});
})();


(function($) {

	var SLICK_OPTIONS = {
		pauseOnFocus: false,
		pauseOnHover: false,
		autoplayDuration: 500,
		speed: 200
	};

	var prepareSlideLoading = function(slick, index) {
		var real = index % slick.$slides.length;
		if (real < 1) return;
		var item = slick.$slides[real].getElementsByTagName('img');
		if (!item.length) return;
		var img = item[0];
		if (img.hasLoaded()) return;
		var src = img.getAttribute('data-lazier');
		if (!src) return;
		//console.log('Preparing slide for lazy loading', index, src);
		img.setAttribute('data-lazy', src);
		img.removeAttribute('data-lazier');
	};

	$(document).ready(function() {
	
		var $slideshows = $('.slideshow');
		var IS_SLIDESHOW_PAGE = $slideshows.length === 1;

		$slideshows.each(function() {
			var $s = $(this);
			var $nav = $s.children('button');
			setTimeout(function() {
				$s.find('.images').slick($.extend(SLICK_OPTIONS, {
					lazyLoad: IS_SLIDESHOW_PAGE ? 'progressive' : 'ondemand',
					prevArrow: $nav.first(),
					nextArrow: $nav.last()
				})).on('beforeChange', function(e, slick, currentIndex, nextIndex) {
					if (!IS_SLIDESHOW_PAGE || nextIndex < 1) return;
					var item = slick.$slides[nextIndex].getElementsByTagName('img');
					if (!item.length) return;
					prepareSlideLoading(slick, nextIndex + 2);
					prepareSlideLoading(slick, nextIndex + 3);
					slick.progressiveLazyLoad();
					var img = item[0];
					if (img.hasLoaded()) return;
					img.addEventListener('load', function() {
						slick.play();
						//console.log('The image has loaded. Lets continue', nextIndex, img.src);
					});
					//console.log('Next image has not loaded. Lets pause', nextIndex, img.src);
					slick.pause();
				});
			}, 100);
		});
		
		if (IS_SLIDESHOW_PAGE) {
			setTimeout(function() {
				var slick = $slideshows.find('.images').slick('getSlick');
				prepareSlideLoading(slick, 1);
				prepareSlideLoading(slick, 2);
				slick.progressiveLazyLoad();
				$.featherlight.defaults.beforeOpen = slick.pause.bind(slick);
				$.featherlight.defaults.beforeClose = slick.play.bind(slick);
				setTimeout(slick.play.bind(slick), 2000);
			}, 200);
			Music.play(JSON.parse($slideshows[0].dataset.music).map(function(name) { return ASSETS_URL + 'slideshows/' + $slideshows[0].dataset.name + '/' + name; }));
		}
	
	});

})(jQuery);
