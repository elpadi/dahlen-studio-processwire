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

}
var app = new App();
