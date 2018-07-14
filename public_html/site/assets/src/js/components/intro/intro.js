class Intro {

	constructor() {
		this.sequence = app.config.INTRO_SEQUENCE;
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

	showLogo() {
		let p = document.querySelectorAll('#logo path');
		console.log('Intro.showLogo', p);
		for (let i = 1; i <= p.length; i++) {
			p[i - 1].style.transitionDelay = `${i * Intro.LOGO_CHAR_DELAY}ms`;
		}
		requestAnimationFrame(() => document.getElementById('logo').classList.add('visible'));
		return new Promise(resolve => setTimeout(resolve, (p.length + 1) * Intro.LOGO_CHAR_DELAY));
	}

	showMenu() {
		let items = document.querySelectorAll('#main-menu > ul > li > ul > li');
		console.log('Intro.showMenu', items);
		let showItem = item => {
			item.classList.add('visible');
			setTimeout(() => item.classList.add('reset-color'), Intro.MENU_COLOR_DELAY);
		};
		for (let i = 1; i <= items.length; i++)
			setTimeout(showItem.bind(this, items[i - 1]), i * Intro.MENU_ITEM_DELAY);
		return new Promise(resolve => setTimeout(resolve, (items.length + 1) * Intro.MENU_ITEM_DELAY + Intro.MENU_COLOR_DELAY + Intro.MENU_COLOR_DURATION))
			.then(() => document.body.classList.remove('menu-intro'));
	}

	showBed() {
		console.log('Intro.showBed');
		let motions = [], bed;
		for (let i = 0; i < app.loadingQueue.list.size(); i++) {
			let motion = app.loadingQueue.list.item(i).data;
			if (i == 0) bed = motion;
			motions.push(motion);
		}
		app.playingQueue = new MotionPlayingQueue(motions);
		app.playingQueue.setupRelays();
		bed.node.style.opacity = 1;
		// trigger play after one second
		setTimeout(function() { app.playingQueue.start(bed); }, 1000);
		return new Promise(resolve => bed.on('finished', resolve));
	}

	showImages() {
		console.log('Intro.showBed');
		app.playingQueue.setupRelays();
		app.playingQueue.start(app.loadingQueue.list.item(1).data);
		return Promise.resolve(true);
		/*
		app.playingQueue = new MotionPlayingQueue(motions);
		let motions = Array.from(document.querySelectorAll('.motion')).map(node => new Motion(node));
		app.playingQueue = new MotionPlayingQueue(motions);
		motions[0].style.opacity = 1;
		// trigger play after one second
		setTimeout(function() { app.playingQueue.start(app.loadingQueue.list.item(0).data); }, 1000);
		return new Promise(resolve => app.loadingQueue.list.last().data.on('finished', resolve));
		*/
	}

	/*
	hideBed() {
		console.log('Intro.hideBed');
		return new Promise(function(resolve, reject) {
			Motion.list.head().data.remove();
			// Hide and resolve promise 1 second after the last image.
			setTimeout(resolve, Motion.CONTAINER_FADE_DURATION + Motion.LAST_IMAGE_DELAY + 1000);
		});
	}

	showAnaLisboa() {
		console.log('Intro.showAnaLisboa');
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
	*/

}

Intro.LOGO_CHAR_DELAY = 100;
Intro.MENU_ITEM_DELAY = 1000;
Intro.MENU_COLOR_DELAY = 500;
Intro.MENU_COLOR_DURATION = 1000;
