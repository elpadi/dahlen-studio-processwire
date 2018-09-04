class ThumbGrid {

	constructor(gridInfo) {
		this.container = document.createElement('aside');
		this.container.classList.add('thumbs-grid');
		this.container.classList.add('grid-' + gridInfo.count);
		this.createColumns(gridInfo.count);
		if ('minWidth' in gridInfo) {
			this.mediaQuery = window.matchMedia(`(min-width: ${gridInfo.minWidth}px)`);
		}
		else this.mediaQuery = null;
	}

	createColumns(count) {
		this.columns = [];
		for (let i = 0; i < count; i++) {
			let col = document.createElement('section');
			this.container.appendChild(col);
			this.columns.push(col);
		}
	}

	hydrate(items) {
		let count = this.columns.length;
		items.forEach((item, i) => this.columns[i % count].appendChild(item));
	}

}
