class App {

	constructor() {
		this.config = {};
		this.initQueue = [];
		this.isDocReady = false;
		jQuery(document).ready(this.onDocumentReady.bind(this));
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
