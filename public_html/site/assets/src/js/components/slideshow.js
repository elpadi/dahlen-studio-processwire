(function($) {
	$(document).ready(function() {
	
		var $slideshows = $('.slideshow');
		$slideshows.each(function() {
			var $s = $(this);
			var $nav = $s.children('button');
			setTimeout(function() { $s.find('.images').slick({
				pauseOnFocus: false,
				pauseOnHover: false,
				autoplayDuration: 500,
				lazyLoad: $slideshows.length === 1 ? 'progressive' : 'ondemand',
				prevArrow: $nav.first(),
				speed: 200,
				nextArrow: $nav.last()
			}); }, 100);
		});
		
		if ($slideshows.length === 1) {
			setTimeout(function() {
				var slick = $slideshows.find('.images').slick('getSlick');
				$.featherlight.defaults.beforeOpen = slick.pause.bind(slick);
				$.featherlight.defaults.beforeClose = slick.play.bind(slick);
				setTimeout(slick.play.bind(slick), 2000);
			}, 200);
			Music.play(JSON.parse($slideshows[0].dataset.music).map(function(name) { return ASSETS_URL + 'slideshows/' + $slideshows[0].dataset.name + '/' + name; }));
		}
	
	});
})(jQuery);
