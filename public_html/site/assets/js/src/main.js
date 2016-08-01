(function($) {
	$(document).ready(function() {
		$('.page-title')
		.add('#main-content')
		.add($('#main-content').children())
		.each(function(i, el) {
			setTimeout(function() { el.style.opacity = '1'; }, i * 100);
		});
	});
})(jQuery);
