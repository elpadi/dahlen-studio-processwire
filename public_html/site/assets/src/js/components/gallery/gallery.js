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
		//this.galleryNode = node.children[0];
		this.initialSetup();
		/*
		this.pager = new GalleryPager(window[this.node.dataset.name], this.galleryNode.getElementsByTagName('a').length, this);
		if (document.body.scrollHeight < window.innerHeight * 1.6) this.pager.next();
		app.music.play(this.node.dataset.name);
		*/
	}

	createImageElement(info, index) {
		let img = new Image();
		if (app.config.IS_LOCAL) {
			img.src = window['static_test_images'][index % window['static_test_images'].length];
		}
		return img;
	}

	createThumbElement(info, index) {
		let a = document.createElement('a');
		a.dataset.index = index;
		if (app.config.IS_LOCAL) {
			let href = window['static_test_images'][index % window['static_test_images'].length]
			a.href = href;
		}
		let img = new Image();
		if (app.config.IS_LOCAL) {
			img.src = a.href;
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
		this.images = window[this.name].map(this.createImageElement.bind(this));
		this.thumbs = window[this.name].map(this.createThumbElement.bind(this));
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
