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

}

Intro.LOGO_CHAR_DELAY = 100;
Intro.MENU_ITEM_DELAY = 1000;
Intro.MENU_COLOR_DELAY = 500;
Intro.MENU_COLOR_DURATION = 1000;
