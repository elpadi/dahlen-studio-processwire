(function($) {

	$(document).ready(function() {
		$('.slideshow').each(function() {
			var $s = $(this);
			var $nav = $s.find('nav > button');
			setTimeout(function() { $s.find('.images').slick({
				prevArrow: $nav.first(),
				nextArrow: $nav.last()
			}); }, 100);
		});
	});
})(jQuery);
