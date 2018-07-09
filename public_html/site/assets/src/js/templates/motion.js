(function($, app) {

	app.init(function() {
		let motions = Array.from(document.querySelectorAll('.motion')).map(node => new Motion(node));
		app.loadingQueue = new MotionLoadingQueue(motions);
		// autoplay
		if (document.body.classList.contains('template--home')) {
			app.playingQueue = new MotionPlayingQueue(motions);
		}
	});

})(jQuery, window.app);
