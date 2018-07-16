class App {

	constructor() {
		this.config = {};
		this.initQueue = [];
		this.isDocReady = false;
		this.init(this.initApp.bind(this));
		jQuery(document).ready(this.onDocumentReady.bind(this));
	}

	initApp() {
		this.mainMenu = MainDropdown.create();
		this.music = new Music(new MusicMuter());
	}

	init(fn) {
		if (this.isDocReady) fn();
		else this.initQueue.push(fn);
	}

	onDocumentReady() {
		let fn;
		while (fn = this.initQueue.shift()) fn();
		this.isDocReady = true;
	}

	setConfig(obj) {
		for (let key of Object.keys(obj)) this.config[key] = obj[key];
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

}

Promise.delay = function(duration, fn) {
	return new Promise(function(resolve) {
		setTimeout(function() { resolve(fn ? fn() : true); }, duration);
	});
};

var app = new App();
