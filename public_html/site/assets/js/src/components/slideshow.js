(function($) {
	$(document).ready(function() {
	
		var $slideshows = $('.slideshow');
		$slideshows.each(function() {
			var $s = $(this);
			var $nav = $s.find('nav > button');
			setTimeout(function() { $s.find('.images').slick({
				prevArrow: $nav.first(),
				nextArrow: $nav.last()
			}); }, 100);
		});
		
		if ($slideshows.length === 1) {
			setTimeout(function() {
				var slick = $slideshows.find('.images').slick('getSlick');
				$slideshows.on('mouseenter', slick.pause.bind(slick)).on('mouseleave', slick.play.bind(slick));
				setTimeout(slick.play.bind(slick), 3000);
			}, 200);
		}
	
	});
})(jQuery);
