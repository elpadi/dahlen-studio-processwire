class Intro {

	constructor() {
		this.sequence = ['bed','menu','ana lisboa','intro'];
	}

	init() {
		document.body.classList.add('menu-intro');
		let p = Promise.resolve(true);
		for (let key of this.sequence) {
			for (let action of ['show','hide']) {
				let fn = _.camelCase(action + ' ' + key);
				if (fn in this) p = p.then(_.bindKey(this, fn));
			}
		}
	}

	showBed() {
		console.log('Intro.showBed');
		let bed = Motion.list.head().data;
		bed.dom_node.style.opacity = 1;
		// trigger play after one second
		setTimeout(function() { bed.onPlayButtonClick(); }, 1000);
		return bed.getPromise('finished');
	}

	hideBed() {
		console.log('Intro.hideBed');
		return new Promise(function(resolve, reject) {
			Motion.list.head().data.remove();
			// Hide and resolve promise 1 second after the last image.
			setTimeout(resolve, Motion.CONTAINER_FADE_DURATION + Motion.LAST_IMAGE_DELAY + 1000);
		});
	}

	showMenu() {
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
	}

	showAnaLisboa() {
		console.log('Intro.showAnaLisboa');
		document.body.classList.remove('menu-intro');
		var ana = Motion.list.item(1).data;
		ana.addToPlayingQueue();
		return ana.getPromise('finished');
	}

	showIntro() {
		console.log('Intro.showIntro');
		var intro = Motion.list.item(2).data;
		return intro.getPromise('finished');
	}

	finishIntro() {
		console.log('Intro.finishIntro');
		Motion.list.item(2).data.remove();
		Music.stop();
	}

}
