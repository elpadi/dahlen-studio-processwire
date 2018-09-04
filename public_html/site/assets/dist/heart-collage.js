"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n};!function(n){"function"==typeof define&&define.amd?define(["jquery"],function(e){return n(e)}):"object"===("undefined"==typeof module?"undefined":_typeof(module))&&"object"===_typeof(module.exports)?exports=n(require("jquery")):n(jQuery)}(function(n){n.easing.jswing=n.easing.swing;var e=Math.pow,t=Math.sqrt,u=Math.sin,r=Math.cos,o=Math.PI,i=1.70158,c=1.525*i,a=2*o/3,f=2*o/4.5;function s(n){var e=7.5625,t=2.75;return n<1/t?e*n*n:n<2/t?e*(n-=1.5/t)*n+.75:n<2.5/t?e*(n-=2.25/t)*n+.9375:e*(n-=2.625/t)*n+.984375}n.extend(n.easing,{def:"easeOutQuad",swing:function(e){return n.easing[n.easing.def](e)},easeInQuad:function(n){return n*n},easeOutQuad:function(n){return 1-(1-n)*(1-n)},easeInOutQuad:function(n){return n<.5?2*n*n:1-e(-2*n+2,2)/2},easeInCubic:function(n){return n*n*n},easeOutCubic:function(n){return 1-e(1-n,3)},easeInOutCubic:function(n){return n<.5?4*n*n*n:1-e(-2*n+2,3)/2},easeInQuart:function(n){return n*n*n*n},easeOutQuart:function(n){return 1-e(1-n,4)},easeInOutQuart:function(n){return n<.5?8*n*n*n*n:1-e(-2*n+2,4)/2},easeInQuint:function(n){return n*n*n*n*n},easeOutQuint:function(n){return 1-e(1-n,5)},easeInOutQuint:function(n){return n<.5?16*n*n*n*n*n:1-e(-2*n+2,5)/2},easeInSine:function(n){return 1-r(n*o/2)},easeOutSine:function(n){return u(n*o/2)},easeInOutSine:function(n){return-(r(o*n)-1)/2},easeInExpo:function(n){return 0===n?0:e(2,10*n-10)},easeOutExpo:function(n){return 1===n?1:1-e(2,-10*n)},easeInOutExpo:function(n){return 0===n?0:1===n?1:n<.5?e(2,20*n-10)/2:(2-e(2,-20*n+10))/2},easeInCirc:function(n){return 1-t(1-e(n,2))},easeOutCirc:function(n){return t(1-e(n-1,2))},easeInOutCirc:function(n){return n<.5?(1-t(1-e(2*n,2)))/2:(t(1-e(-2*n+2,2))+1)/2},easeInElastic:function(n){return 0===n?0:1===n?1:-e(2,10*n-10)*u((10*n-10.75)*a)},easeOutElastic:function(n){return 0===n?0:1===n?1:e(2,-10*n)*u((10*n-.75)*a)+1},easeInOutElastic:function(n){return 0===n?0:1===n?1:n<.5?-e(2,20*n-10)*u((20*n-11.125)*f)/2:e(2,-20*n+10)*u((20*n-11.125)*f)/2+1},easeInBack:function(n){return 2.70158*n*n*n-i*n*n},easeOutBack:function(n){return 1+2.70158*e(n-1,3)+i*e(n-1,2)},easeInOutBack:function(n){return n<.5?e(2*n,2)*(7.189819*n-c)/2:(e(2*n-2,2)*((c+1)*(2*n-2)+c)+2)/2},easeInBounce:function(n){return 1-s(1-n)},easeOutBounce:s,easeInOutBounce:function(n){return n<.5?(1-s(1-2*n))/2:(1+s(2*n-1))/2}})});class Jigsaw extends EventEmitter {

	constructor(node) {
		super();
		this.node = node;
		this.pieces = _.shuffle(node.dataset.pieces.split(',')).map(n => new JigsawPiece(n));
		this.pieceCount = this.pieces.length;
		this.baseUrl = app.config.ASSETS_URL + 'slideshows/' + node.dataset.name;
		this.INITIAL_DELAY = 500;
		this.next = _.bindKey(this, 'nextPiece');
		this.loadPieces().then(this.next);
	}

	loadPieces() {
		return Promise.all(_.invokeMap(this.pieces, 'load', this.baseUrl)).then(_.bindKey(this, 'trigger', 'piecesloaded'));
	}

	nextPiece() {
		let piece = this.pieces.shift();
		this.node.appendChild(piece.node);
		let p = 1 - this.pieces.length / this.pieceCount;
		let t = jQuery.easing.easeInQuad(p);
		console.log('Jigsaw.nextPiece', piece.name, p, t);
		if (p < 1) setTimeout(this.next, t * 500);
		else this.end();
	}

	end() {
		this.trigger('finished');
	}

}
class JigsawPiece {

	constructor(name) {
		this.node = new Image();
		this.node.classList.add('piece');
		this.name = name;
		this.setPosition();
	}

	setPosition() {
		let pos = this.name.replace(/piece-(.*)\.png/, '$1').split('x');
		this.node.style.cssText = `left: ${pos[0]}px; top: ${pos[1]}px;`;
	}

	load(baseUrl) {
		return new Promise(resolve => {
			this.node.addEventListener('load', resolve);
			this.node.src = baseUrl + '/' + this.name;
		});
	}

}
class HeartCollage extends Jigsaw {

	constructor(node) {
		super(node);
		this.finishingPieces = node.dataset.afterPieces.split(',').map((n, i) => new HeartCollagePiece(n, i));
		this.beforeEnd = _.bindKey(this, 'nextFinishingPiece');
	}

	showPiece(piece) {
		piece.node.classList.add('visible');
		requestAnimationFrame(this.beforeEnd);
	}

	nextFinishingPiece() {
		let piece = this.finishingPieces.shift();
		if (piece) {
			console.log('Jigsaw.nextFinishingPiece', piece.name, piece.delay);
			setTimeout(this.showPiece.bind(this, piece), piece.delay * 1000);
		}
		else super.end();
	}

	end() {
		requestAnimationFrame(this.beforeEnd);
	}

}
class HeartCollagePiece extends JigsawPiece {

	constructor(id, index) {
		super(id);
		this.node = document.getElementById(id);
		this.name = id;
		this.node.style.zIndex = index + 2;
		this.delay = parseInt(this.node.dataset.delay, 10);
	}

}
app.init(function() {
	let node = document.querySelector('.jigsaw');
	app.heartCollage = new HeartCollage(node);
	app.heartCollage.on('piecesloaded', () => app.music.play(node.dataset.name));
	app.heartCollage.on('finished', () => app.music.stop());
});
