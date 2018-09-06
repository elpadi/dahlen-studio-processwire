(function($) {

	app.load(function() {
		$('#main-content .video').removeClass('fade-out');
		setTimeout(function() {
			_.invokeMap($('#main-content video'), 'play');
		}, 1000);
	});

})(jQuery);
