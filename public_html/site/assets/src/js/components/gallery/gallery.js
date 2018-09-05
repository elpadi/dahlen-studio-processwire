class Gallery {

	constructor(node) {
		if (!node) {
			throw new Error("Not a valid slideshow element.");
		}
		this.node = node;
		this.name = node.dataset.name;
		this.thumbs = [];
		this.images = [];
		if (!this.name in window) {
			throw new Error("Error in slideshow JS setup.");
		}
		this.initialSetup();
	}

	setupThumbGrids() {
		this.grid = new ThumbGrid();
		this.node.appendChild(this.grid.container);
		$(this.node).on('click', 'a', this.onThumbClick.bind(this));
	}

	setupMainSlider() {
		this.main = document.createElement('main');
		this.main.className = 'h-imgs fade fade-out';
		document.body.appendChild(this.main);
		this.main.addEventListener('click', this.hideMainSlider.bind(this));
	}

	onThumbClick(e) {
		e.preventDefault();
		let index = e.currentTarget.dataset.index, scroll;
		if ((index in this.images) && this.images[index].main) {
			let img = this.images[index].main;
			scroll = img.offsetLeft - (window.innerWidth / 2) + (img.offsetWidth / 2);
		}
		else scroll = this.main.scrollWidth - this.main.offsetWidth;
		this.main.scrollTo(scroll, 0);
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
		//this.createImageElements();
		this.images = window[this.name].map(GalleryImage.create);
		this.setupMainSlider();
		this.setupThumbGrids();
	}

	onThumbLoaded(img, index) {
		this.images[index].thumb = img;
		this.images[index].createLink(this.name);
		this.grid.addItem(this.images[index]);
	}

	onMainImageLoaded(img, index) {
		this.images[index].main = img;
		this.main.appendChild(img);
	}

	onImageLoaded(img, index) {
		this[index % 2 == 0 ? 'onThumbLoaded' : 'onMainImageLoaded'].call(this, img, Math.floor(index / 2));
	}

	load() {
		let size = this.node.offsetWidth / this.grid.columnCount;
		let srcs = _.flatten(this.images.map(i => [i.getThumbSrc(this.name, size), i.getMainSrc(this.name, size)]));
		let loader = new ImageLoader(srcs);
		loader.events.addEventListener('imageloaded', e => this.onImageLoaded(e.detail.image, e.detail.index));
		loader.loadAll();
	}

}
