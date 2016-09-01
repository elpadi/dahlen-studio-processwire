(function($) {
	var showBed = function() {
		var bed = Motion.list.head().data;
		bed.dom_node.style.opacity = 1;
		setTimeout(function() { bed.play(); }, 1000);
		return bed.getPromise('finished');
	};

	var hideBed = function() {
		return new Promise(function(resolve, reject) {
			Motion.list.head().data.remove();
			setTimeout(resolve, Motion.CONTAINER_FADE_DURATION + Motion.LAST_IMAGE_DELAY + 1000);
		});
	};

	var showMenu = function(bed) {
		var DELAY = 800;
		return new Promise(function(resolve, reject) {
			var $items = $('#main-menu > ul > li > ul > li');
			$('#logo').addClass('visible');
			$items.each(function(i, el) {
				setTimeout(function() {
					el.classList.add('visible');
					el.classList.add('reset-color');
				}, (i + 3) * DELAY);
				setTimeout(resolve, ($items.length + 5) * DELAY);
			});
		});
	};

	var showAnaLisboa = function() {
		document.body.classList.remove('menu-intro');
		var ana = Motion.list.item(1).data;
		ana.addToPlayingQueue();
		return ana.getPromise('finished');
	};

	var showIntro = function() {
		var intro = Motion.list.item(2).data;
		intro.addToPlayingQueue();
		return intro.getPromise('finished');
	};

	$(window).on('load', function() {
		if (!document.body.classList.contains('template--home')) return;
		document.body.classList.add('menu-intro');
		
		// allow time for motion init code
		setTimeout(function() {
			showBed()
			.then(hideBed)
			.then(showMenu)
			.then(showAnaLisboa)
			.then(showIntro)
			.then(function() {});
		}, 100);

	});
})(jQuery);
