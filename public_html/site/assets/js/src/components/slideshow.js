(function($) {
	$(document).ready(function() {
	
		var $slideshows = $('.slideshow');
		$slideshows.each(function() {
			var $s = $(this);
			var $nav = $s.find('nav > button');
			setTimeout(function() { $s.find('.images').slick({
				pauseOnFocus: false,
				pauseOnHover: false,
				autoplayDuration: 2000,
				lazyLoad: 'progressive',
				prevArrow: $nav.first(),
				nextArrow: $nav.last()
			}); }, 100);
		});
		
		if ($slideshows.length === 1) {
			setTimeout(function() {
				var slick = $slideshows.find('.images').slick('getSlick');
				$slideshows.find('img').on('mouseenter', slick.pause.bind(slick)).on('mouseleave', slick.play.bind(slick));
				setTimeout(slick.play.bind(slick), 2000);
			}, 200);
		}
	
	});
})(jQuery);
