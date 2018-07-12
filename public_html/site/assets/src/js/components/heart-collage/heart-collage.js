class HeartCollage extends Jigsaw {

	constructor(node) {
		super(node);
		this.finishingPieces = node.dataset.afterPieces.split(',').map((n, i) => new HeartCollagePiece(n, i));
		this.beforeEnd = _.bindKey(this, 'nextFinishingPiece');
	}

	nextFinishingPiece() {
		let piece = this.finishingPieces.shift();
		piece.node.classList.add('visible');
		console.log('Jigsaw.nextFinishingPiece', piece.name, piece.delay);
		if (this.finishingPieces.length) setTimeout(this.beforeEnd, piece.delay * 1000);
		else super.end();
	}

	end() {
		requestAnimationFrame(this.beforeEnd);
	}

}
