class HeartCollage extends Jigsaw {

	constructor(node) {
		super(node);
		this.finishingPieces = node.dataset.afterPieces.split(',').map(n => new HeartCollagePiece(n));
		this.beforeEnd = _.bindKey(this, 'nextFinishingPiece');
	}

	nextFinishingPiece() {
		let piece = this.finishingPieces.shift();
		piece.node.classList.add('visible');
		//piece.node.style.opacity = 1;
		console.log('Jigsaw.nextFinishingPiece', piece.name, piece.delay);
		if (this.finishingPieces.length) setTimeout(this.nextEnd, piece.delay * 1000);
		else super.end();
	}

	end() {
		requestAnimationFrame(this.beforeEnd);
	}

}
