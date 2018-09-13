class EventEmitter {

	constructor() {
		this.events = document.createDocumentFragment();
		this.triggeredEvents = [];
	}

	on() {
		this.events.addEventListener.apply(this.events, arguments);
	}

	when(name) {
		return this.hasTriggered(name)
			? Promise.resolve(true)
			: new Promise((resolve, reject) => {
				this.on(name, resolve);
			})
	}

	hasTriggered(name) {
		return this.triggeredEvents.indexOf(name) != -1;
	}

	trigger(name, data) {
		console.log('EventEmitter.trigger', name, data);
		if (data == undefined) data = {};
		this.events.dispatchEvent(new CustomEvent(name, { detail: data }));
		if (!this.hasTriggered(name)) this.triggeredEvents.push(name);
	}

}
class TimeoutEventEmitter extends EventEmitter {

	constructor(name, duration) {
		super();
		this.name = name;
		this.duration = duration;
		this.timeoutId = 0;
	}

	onTimeout() {
		console.log('TimeoutEventEmitter.onTimeout');
		this.timeoutId = 0;
		this.trigger(this.name);
	}

	clear() {
		console.log('TimeoutEventEmitter.clear');
		clearTimeout(this.timeoutId);
		this.timeoutId = 0;
	}

	reset() {
		console.log('TimeoutEventEmitter.reset');
		if (this.timeoutId) this.clear();
		this.timeoutId = window.setTimeout(this.onTimeout.bind(this), this.duration);
	}

}
class EventQueue {

	constructor(queue) {
		this.queue = queue === undefined ? [] : queue;
		this.hasEventFired = false;
		this.attachEventHandler();
	}

	add(fn) {
		if (this.hasEventFired) fn();
		else this.queue.push(fn);
	}

	runQueue() {
		let fn;
		while (fn = this.queue.shift()) fn();
		this.hasEventFired = true;
	}

}
class InitEventQueue extends EventQueue {

	attachEventHandler() {
		jQuery(document).ready(this.runQueue.bind(this));
	}
	
}
class LoadEventQueue extends EventQueue {

	attachEventHandler() {
		window.addEventListener('load', this.runQueue.bind(this));
	}
	
}
class ResettableTimeout {

	constructor(duration, fn) {
		this.id = 0;
		this.duration = duration;
		this.fn = fn;
	}

	clear() {
		clearTimeout(this.id);
		this.id = 0;
	}

	reset() {
		this.id = setTimeout(this.onTimeout.bind(this), this.duration);
	}

	onTimeout() {
		this.id = 0;
		this.fn();
	}

	isWaiting() {
		return Boolean(this.id);
	}

}
class Music {

	constructor(muter) {
		this.playlist = {};
		this.hideMuteTimeoutId = 0;
		this.baseUrl = app.config.ASSETS_URL + 'slideshows/';
		this.muter = muter;
		this.currentPlaylist = undefined;
		for (let n of document.querySelectorAll('[data-music]')) {
			if (n.dataset.music && 'name' in n.dataset) {
				let urls = n.dataset.music.split(' ').map(s => this.baseUrl + n.dataset.name + '/' + s);
				this.playlist[n.dataset.name] = new MusicPlaylist(urls, this.muter);
			}
		}
	}

	stop() {
		if (this.currentPlaylist) this.playlist[this.currentPlaylist].stop();
		this.currentPlaylist = undefined;	
	}

	play(name) {
		if (name in this.playlist) {
			if (!this.currentPlaylist || name == this.currentPlaylist) this.playlist[name].play();
			else {
				this.playlist[this.currentPlaylist].stop().then(this.play.bind(this, name));
			}
			this.currentPlaylist = name;
		}
	}

}
class MusicMuter {

	constructor() {
		this.hideButtonTimeout = new ResettableTimeout(MusicPlaylist.FADE_DURATION + 1000, this.hideButton.bind(this));
		this.muteButton = document.getElementById('sound-button');
		this.muteButton.addEventListener('click', this.toggleMute.bind(this));
	}

	setAudio(audio) {
		this.audio = audio;
		this[Number(Cookies.get(MusicMuter.COOKIE_NAME)) ? 'mute' : 'unmute'].call(this);
	}

	buttonState(state) {
		this.muteButton.classList.add('state--' + state);
		this.muteButton.classList.remove('state--' + (state == 'on' ? 'off' : 'on'));
	}

	mute() {
		console.log('MusicMuter.mute');
		this.audio.mute();
		this.buttonState('off');
	}

	unmute() {
		console.log('MusicMuter.unmute');
		this.audio.unmute();
		this.buttonState('on');
	}

	isMuted() {
		return this.audio.isMuted();
	}

	updateMuteCookie() {
		Cookies.set(MusicMuter.COOKIE_NAME, String(Number(this.isMuted())), { expires: 365 });
	}

	toggleMute() {
		console.log('MusicPlaylist.toggleMute');
		if ('audio' in this) {
			this[this.isMuted() ? 'unmute' : 'mute'].call(this);
			this.updateMuteCookie();
		}
	}

	hideButton() {
		this.hideButtonTimeout.clear();
		document.body.classList.remove('music-playing');
	}

	showButton() {
		this.hideButtonTimeout.clear();
		document.body.classList.add('music-playing');
	}

}

MusicMuter.COOKIE_NAME = 'is_sound_muted';
class MusicPlaylist {

	constructor(urls, muter) {
		this.urls = urls;
		this.index = 0;
		this.muter = muter;
		this.createAudio();
		console.log('MusicPlaylist.constructor', urls);
	}

	createAudio() {
		this.audio = new buzz.sound(this.urls[this.index], {
			formats: ['ogg','mp3'],
			autoplay: false,
			volume: 0,
			preload: true,
			loop: false
		});
		this.muter.setAudio(this.audio);
		this.audio.bind('ended', this.next.bind(this));
	}

	stop() {
		this.muter.hideButtonTimeout.reset();
		console.log('MusicPlaylist.stop');
		return new Promise((resolve) => {
			this.audio.fadeOut(MusicPlaylist.FADE_DURATION, resolve);
		});
	}

	play(index) {
		console.log('MusicPlaylist.play', index);
		if (index === undefined) index = this.index;
		if (index === this.index && !this.audio.isPaused()) return;
		this.muter.showButton();
		if (this.audio.isPaused()) {
			if (index !== this.index) this.createAudio();
			this.audio.setVolume(0).play().fadeIn(MusicPlaylist.FADE_DURATION);
			this.index = index;
		}
		else this.stop().then(this.play.bind(this, index));
	}

	next() {
		if (this.index < this.urls.length - 1) this.play(this.index + 1);
	}

}

MusicPlaylist.FADE_DURATION = 5000;
class Dropdown {

	constructor(node) {
		this.node = node;
		this.VERTICAL_PADDING = 2;
		requestAnimationFrame(this.setupSubMenus.bind(this));
	}

	setupSubMenus() {
		let uls = Array.from(this.node.querySelectorAll('ul'));
		this.submenus = uls.map(ul => new DropdownSubmenu(ul, this));
		let h = Math.max.apply(window, uls.map(ul => ul.offsetHeight));
		this.node.style.height = `calc(${h}px + ${this.VERTICAL_PADDING}em)`;
	}

	getSubmenuFromTrigger(node) {
		if (node.nodeName !== 'A') return null;
		return node.nextElementSibling ? new DropdownSubmenu(node.nextElementSibling) : null;
	}

	hasSubmenuOpen() {
		return this.node.querySelectorAll('.open').length > 0;
	}

	hideAll(skip) {
		console.log('Dropdown.hideAll', skip);
		for (let n of this.node.querySelectorAll('.open')) if (n != skip) n.classList.remove('open');
		if (!skip) this.onChange();
	}

	onChange() {
	}

}
class DropdownSubmenu {

	constructor(node, dropdown) {
		this.node = node;
		this.dropdown = dropdown;
		this.lastUpdateTime = 0;
		node.previousSibling.addEventListener('click', this.toggle.bind(this));
		this.setupMouseHover();
	}

	isOpen() {
		return this.node.classList.contains('open');
	}

	updateClass(method) {
		let d = Date.now();
		if (d - this.lastUpdateTime < 128) return;
		this.lastUpdateTime = d;
		this.node.classList[method]('open');
		this.dropdown.hideAll(this.node);
		this.dropdown.onChange();
	}

	open() {
		this.updateClass('add');
	}

	toggle(e) {
		if (e) e.preventDefault();
		this.updateClass('toggle');
	}

	close() {
		this.updateClass('remove');
	}

	setupMouseHover() {
		this.node.previousSibling.addEventListener('mouseenter', this.open.bind(this));
	}

}
class AutohideDropdown extends Dropdown {

	constructor(node) {
		super(node);
	}

	setupAutoHide() {
		this.autoHide = new TimeoutEventEmitter('autohide', Dropdown.AUTOHIDE_DURATION);
		this.autoHide.on('autohide', this.hideAll.bind(this));
		this.node.addEventListener('mouseleave', _.bindKey(this.autoHide, 'reset'));
		for (let s of this.submenus) {
			s.node.addEventListener('mouseenter', _.bindKey(this.autoHide, 'clear'));
		}
	}

	setupSubMenus() {
		super.setupSubMenus();
		this.setupAutoHide();
	}

	onChange() {
		this.autoHide.clear();
	}

}
class MainDropdown extends AutohideDropdown {

	constructor(node) {
		super(node);
		document.addEventListener('click', this.onDocumentClick.bind(this));
	}

	updateBodyClass() {
		document.body.classList.toggle('submenu-open', this.hasSubmenuOpen());
	}

	onChange() {
		super.onChange();
		requestAnimationFrame(this.updateBodyClass.bind(this));
	}

	onDocumentClick(e) {
		if (!this.node.contains(e.target)) {
			this.hideAll();
		}
	}

}

MainDropdown.MEDIA_QUERY_BREAKPOINT = 840;

MainDropdown.create = function() {
	if (window.innerWidth < MainDropdown.MEDIA_QUERY_BREAKPOINT) return;
	let node = document.getElementById('main-menu').querySelector('a').nextElementSibling;
	if (!node) throw new Error("Could not find main menu element.");
	return new MainDropdown(node);
};
class App {

	constructor() {
		this.config = {};
		this.initQueue = new InitEventQueue([this.initApp.bind(this)]);
		this.loadQueue = new LoadEventQueue([this.loadApp.bind(this)]);
	}

	initApp() {
		this.mainMenu = MainDropdown.create();
		this.music = new Music(new MusicMuter());

		let imgSizes = Object.keys(this.config.IMG_SIZE_HASHES);
		this.MIN_IMG_SIZE = imgSizes[0];
		this.MAX_IMG_SIZE = _.last(imgSizes);
		this.IMAGE_SIZE_AREAS = _.fromPairs(imgSizes.map(s => [s, s * s]));
	}

	loadApp() {
		$('#main-content').removeClass('loading').on('click', 'video', e => this.onVideoClick(e.target));
	}

	onVideoClick(node) {
		node.parentNode.classList.toggle('paused', !node.paused);
		node.paused ? node.play() : node.pause();
	}

	init(fn) {
		this.initQueue.add(fn);
	}

	load(fn) {
		this.loadQueue.add(fn);
	}

	setConfig(obj) {
		for (let key of Object.keys(obj)) this.config[key] = obj[key];
	}

	getValidImageSize(w, h, fallback) {
		let area = w * h;
		let size = _.findKey(this.config.IMAGE_SIZE_AREAS, a => a > area);
		return size ? size : fallback;
	}

	imageUrl(filename, albumName, size) {
		if (size === undefined) return `${this.config.ALBUMS_URL + albumName}/${filename}`;
		if (!(size in this.config.IMG_SIZE_HASHES)) throw new Error("Invalid size.");
		let params = {
			a: albumName,
			i: filename,
			s: size,
			cw: 0,
			ch: 0,
			q: this.config.JPEG_QUALITY,
			check: this.config.IMG_SIZE_HASHES[size]
		};
		let qs = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
		return this.config.ROOT_URL + 'zenphoto/zp-core/i.php?' + qs;
	}

	createIcon(name) {
		let n = document.createElement('span');
		n.className = 'material-icons';
		n.innerHTML = name;
		return n;
	}

}

Promise.delay = function(duration, fn) {
	return new Promise(function(resolve) {
		setTimeout(function() { resolve(fn ? fn() : true); }, duration);
	});
};

var app = new App();
