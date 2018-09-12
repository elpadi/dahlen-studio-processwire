class ThumbGrid {

	constructor(gridInfo) {
		this.container = document.createElement('aside');
		this.container.classList.add('thumbs-grid');
		this.totalRatio = Number.POSITIVE_INFINITY;
		this.columnCount = this.getColumnCount();
	}

	getColumnCount() {
		let w = window.innerWidth;
		if (w >= 1280) return 5;
		if (w >= 980) return 4;
		if (w >= 540) return 3;
		return 2;
	}

	getNextColumnIndex() {
		let h = this.columns.map(c => c.height);
		let min = Math.min.apply(window, h);
		console.log('ThumbGrid.getNextColumnIndex', h, min);
		return h.indexOf(min);
	}

	newRow() {
		this.row = document.createElement('div');
		this.row.className = 'grid-row';
		this.container.appendChild(this.row);
		this.totalRatio = 0;
	}

	addItem(item) {
		if (this.totalRatio > this.columnCount) this.newRow();
		this.totalRatio += item.aspectRatio;
		this.row.style.gridTemplateColumns += ` ${item.aspectRatio}fr `;
		this.row.appendChild(item.link);
		setTimeout(() => item.link.classList.remove('fade-out'), 100);
		//this.columns[this.getNextColumnIndex()].addItem(item);
	}

	hydrate(items) {
		items.forEach(this.addItem.bind(this));
	}

}
