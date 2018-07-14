(function($, app) {

	app.init(function() {
		let motions = Array.from(document.querySelectorAll('.motion')).map(node => new Motion(node));
		app.loadingQueue = new MotionLoadingQueue(motions);
		app.loadingQueue.setupRelays();
		app.loadingQueue.start(app.loadingQueue.list.item(0).data);
	});

})(jQuery, window.app);
