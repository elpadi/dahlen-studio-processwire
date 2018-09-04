class Gallery {

	constructor(node) {
		if (!node) {
			throw new Error("Not a valid slideshow element.");
		}
		this.node = node;
		this.name = node.dataset.name;
		if (!this.name in window) {
			throw new Error("Error in slideshow JS setup.");
		}
		this.initialSetup();
	}

	createImageElement(info, index) {
		let img = new Image();
		if (app.config.IS_LOCAL) {
			img.src = window['static_test_images'][index % window['static_test_images'].length];
		}
		else {
			let size;
			if (info.width > 980 || info.height > 980) size = 1960
			else if (info.width < 980 && info.height < 980) size = undefined;
			else size = 980;
			img.src = app.imageUrl(info.filename, this.name, size);
		}
		return img;
	}

	createThumbElement(info, index) {
		let a = document.createElement('a');
		a.dataset.index = index;
		if (app.config.IS_LOCAL) {
			a.href = window['static_test_images'][index % window['static_test_images'].length];
		}
		else {
			a.href = app.imageUrl(info.filename, this.name);
		}
		let img = new Image();
		if (app.config.IS_LOCAL) {
			img.src = a.href;
		}
		else {
			img.src = app.imageUrl(info.filename, this.name, 320);
		}
		a.appendChild(img);
		return a;
	}

	setupThumbGrids() {
		this.grids = Gallery.GRIDS.map(gridInfo => new ThumbGrid(gridInfo));
		this.grids.forEach((g, i) => {
			if (i > 0) g.mediaQuery.addListener(_.throttle(this.changeActiveGrid.bind(this), 250, { 'trailing': false }));
			this.node.appendChild(g.container);
		});
		this.changeActiveGrid();
	}

	changeActiveGrid() {
		let grids = this.grids.slice(1).filter(g => g.mediaQuery.matches);
		this.activeGrid = grids.length ? grids.pop() : this.grids[0];
		this.activeGrid.hydrate(this.thumbs);
	}

	createImageElements() {
		this.thumbs = window[this.name].map(this.createThumbElement.bind(this));
		this.images = window[this.name].map(this.createImageElement.bind(this));
	}

	setupMainSlider() {
		this.main = document.createElement('main');
		this.main.className = 'h-imgs fade fade-out';
		document.body.appendChild(this.main);
		this.images.forEach(i => this.main.appendChild(i));
		$(this.node).on('click', 'a', this.onThumbClick.bind(this));
	}

	onThumbClick(e) {
		e.preventDefault();
		let img = this.images[e.currentTarget.dataset.index];
		this.main.scrollTo(img.offsetLeft - (window.innerWidth / 2) + (img.offsetWidth / 2), 0);
		this.showMainSlider();
	}

	showMainSlider() {
		this.node.classList.add('fade-out');
		this.main.classList.remove('fade-out');
	}

	hideMainSlider() {
		this.node.classList.remove('fade-out');
		this.main.classList.add('fade-out');
	}

	initialSetup() {
		this.createImageElements();
		this.setupThumbGrids();
		this.setupMainSlider();
		this.main.addEventListener('click', this.hideMainSlider.bind(this));
	}

}

Gallery.GRIDS = [
	{
		count: 3
	},{
		count: 4,
		minWidth: 450
	},{
		count: 6,
		minWidth: 768
	}
];
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
(function($) {

	app.init(function() {
		app.gallery = new Gallery(document.querySelector('.slideshow'));
	});

})(jQuery);
