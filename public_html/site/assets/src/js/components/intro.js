(function($) {
	var showBed = function() {
		console.log('Intro.showBed');
		var bed = Motion.list.head().data;
		bed.dom_node.style.opacity = 1;
		setTimeout(function() { bed.onPlayButtonClick(); }, 1000);
		return bed.getPromise('finished');
	};

	var hideBed = function() {
		console.log('Intro.hideBed');
		return new Promise(function(resolve, reject) {
			Motion.list.head().data.remove();
			setTimeout(resolve, Motion.CONTAINER_FADE_DURATION + Motion.LAST_IMAGE_DELAY + 1000);
		});
	};

	var showMenu = function(bed) {
		var DELAY = 800;
		console.log('Intro.showMenu');
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
		console.log('Intro.showAnaLisboa');
		document.body.classList.remove('menu-intro');
		var ana = Motion.list.item(1).data;
		ana.addToPlayingQueue();
		return ana.getPromise('finished');
	};

	var showIntro = function() {
		console.log('Intro.showIntro');
		var intro = Motion.list.item(2).data;
		return intro.getPromise('finished');
	};

	var finishIntro = function() {
		console.log('Intro.finishIntro');
		Motion.list.item(2).data.remove();
		Music.stop();
	};

	window.runIntro = function() {
		document.body.classList.add('menu-intro');
		showBed()
		.then(hideBed)
		.then(showMenu)
		.then(showAnaLisboa)
		.then(showIntro)
		.then(finishIntro);
	};

})(jQuery);
