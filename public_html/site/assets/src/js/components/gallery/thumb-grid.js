class ThumbGrid {

	constructor(gridInfo) {
		this.container = document.createElement('aside');
		this.container.classList.add('thumbs-grid');
		this.totalRatio = Number.POSITIVE_INFINITY;
		this.columnCount = this.getColumnCount();
		this.rowRatios = [];
	}

	getColumnCount() {
		let w = window.innerWidth;
		if (w >= 1280) return 5;
		if (w >= 980) return 4;
		if (w >= 540) return 3;
		return 2;
	}

	getNextRowIndex(itemRatio) {
		let index = _.findIndex(this.rowRatios, r => r + itemRatio < this.columnCount);
		if (index == -1) {
			this.newRow();
			return this.rowRatios.length - 1;
		}
		return index;
	}

	newRow() {
		this.row = document.createElement('div');
		this.row.className = 'grid-row';
		this.container.appendChild(this.row);
		this.rowRatios.push(0);
		this.fadeDurations = _.shuffle(_.range(500, 3000, 500));
	}

	resizeLastRow() {
		let c = this.container.childElementCount;
		let h = this.container.offsetHeight;
		let avgH = (h - c * ThumbGrid.GRID_GAP) / c;
		let ratios = _.map(this.row.children, a => Number(a.dataset.aspectRatio));
		this.row.style.gridTemplateColumns = ratios.map(r => Math.round(r * avgH) + 'px').join(' ');
	}

	showItem(item) {
		item.link.classList.remove('fade-out');
	}

	addItem(item) {
		let index = this.getNextRowIndex(item.aspectRatio);
		let row = this.container.children[index];
		this.rowRatios[index] += item.aspectRatio;
		row.style.gridTemplateColumns += ` ${item.aspectRatio}fr `;
		item.link.style.transitionDelay = this.fadeDurations.pop() + 'ms';
		row.appendChild(item.link);
		setTimeout(this.showItem.bind(this, item), 100);
	}

}

ThumbGrid.GRID_GAP = 10;
