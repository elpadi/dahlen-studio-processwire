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
		let bed = app.loadingQueue.list.item(0).data;
		bed.node.style.opacity = 1;
		setTimeout(_.bindKey(bed, 'onPlayButtonClick'), Motion.CONTAINER_FADE_DURATION);
		return new Promise(resolve => bed.on('finished', resolve));
	}

	hideBed() {
		let bed = app.loadingQueue.list.item(0).data;
		bed.remove();
		return Promise.delay(Motion.CONTAINER_FADE_DURATION * 3);
	}

	showImages() {
		console.log('Intro.showImages');
		app.playingQueue = app.loadingQueue.clone(items => new MotionPlayingQueue(items.slice(1)));
		app.playingQueue.setupRelays();
		return app.playingQueue.start();
	}

}

Intro.LOGO_CHAR_DELAY = 100;
Intro.MENU_ITEM_DELAY = 1000;
Intro.MENU_COLOR_DELAY = 500;
Intro.MENU_COLOR_DURATION = 1000;
