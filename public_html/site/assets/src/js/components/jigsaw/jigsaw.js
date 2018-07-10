class Jigsaw extends EventEmitter {

	constructor(node) {
		this.node = node;
		this.pieces = _.shuffle(node.dataset.pieces.split(',')).map(n => new JigsawPiece(n));
		this.pieceCount = this.pieces.length;
		this.baseUrl = node.dataset.url;
		this.INITIAL_DELAY = 500;
		this.next = _.bindKey(this, 'nextPiece');
		this.loadPieces().then(this.next);
	}

	loadPieces() {
		return Promise.all(_.invokeMap(this.pieces, 'load'));
	}

	nextPiece() {
		let piece = this.pieces.shift();
		this.node.appendChild(piece.node);
		let p = 1 - this.pieces.length / this.imageCount;
		let t = jQuery.easing.easeOutCubic(p);
		console.log('Jigsaw.nextPiece', piece.name, p, t);
		if (p < 1) setTimeout(this.next, t);
		else this.end();
	}

	end() {
		this.trigger('finished');
	}

}
