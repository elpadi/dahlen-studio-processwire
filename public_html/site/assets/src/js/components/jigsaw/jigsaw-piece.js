class JigsawPiece {

	constructor(name) {
		this.node = new Image();
		this.name = name;
		this.setPosition();
	}

	setPosition() {
		let pos = this.name.replace(/piece-(.*)\.png/, '$1').split('x');
		this.node.style.cssText = `left: ${pos[0]}px; top: ${pos[1]}px;`;
	}

	load() {
		return new Promise(resolve => {
			this.node.addEventListener('load', resolve);
			img.src = this.baseUrl + '/' + this.name;
		});
	}

}
