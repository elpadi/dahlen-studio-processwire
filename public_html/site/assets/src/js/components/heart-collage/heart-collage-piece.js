class HeartCollagePiece extends JigsawPiece {

	constructor(id, index) {
		this.node = document.getElementById(id);
		this.name = id;
		this.node.style.zIndex = index + 2;
		this.delay = parseInt(this.node.dataset.delay, 10);
	}

}
