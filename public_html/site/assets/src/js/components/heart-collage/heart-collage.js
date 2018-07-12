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
