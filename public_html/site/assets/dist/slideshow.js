class ImageLoader extends EventEmitter {

	/**
	 * @param images array List of image names
	 */
	constructor(images) {
		super();
		this.images = images;
		this.chunkSize = 5;
		this.parallelCount = 0;
		this.loadedImages = [];
		this.isLoadingAll = false;
	}

	loadAll() {
		this.isLoadingAll = true;
		return new Promise((resolve, reject) => {
			this.loadChunk(resolve);
		}).then(count => this.trigger('all'));
	}

	loadChunk(resolveAll) {
		let begin = this.loadedImages.length;
		let end = begin + this.chunkSize, max = this.images.length;
		console.log('ImageLoader.loadChunk', begin, end, max);
		return Promise.all(
			_.range(begin, Math.min(end, max)).map(this.loadIndex.bind(this))
		).then(this.onChunkLoaded.bind(this, resolveAll));
	}

	onChunkLoaded(resolveAll) {
		console.log('ImageLoader.onChunkLoaded', this.loadedImages.length);
		this.trigger('chunkloaded');
		if (this.loadedImages.length == this.images.length) {
			resolveAll(this.loadedImages.length);
			this.isLoadingAll = false;
		}
		else {
			if (this.isLoadingAll) this.loadChunk(resolveAll);
		}
		return this.loadedImages.length;
	}

	onImageLoaded(index, img) {
		this.loadedImages.push(index);
		this.parallelCount--;
		console.log('ImageLoader.onImageLoaded', index, this.loadedImages.length);
		this.trigger('imageloaded', { image: img, index: index });
		return index;
	}

	loadImage(src) {
		if (this.parallelCount >= ImageLoader.MAX_PARALLEL_COUNT)
			return Promise.reject(new Error(`Cannot exceed ${ImageLoader.MAX_PARALLEL_COUNT} simultaneous loads.`));
		this.parallelCount++;
		return new Promise((resolve, reject) => {
			let img = new Image();
			let onload = () => {
				img.removeEventListener('load', onload);
				resolve(img);
			};
			img.addEventListener('load', onload);
			img.src = src;
		});
	}

	loadIndex(index) {
		console.log('ImageLoader.loadIndex', index);
		if (this.loadedImages.includes(index))
			return Promise.reject(new Error(`Image [${index}]${this.images[index]} was already loaded.`));
		return this.loadImage(this.images[index]).then(_.bindKey(this, 'onImageLoaded', index));
	}

}

ImageLoader.MAX_PARALLEL_COUNT = 5;
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
class ThumbGrid {

	constructor(gridInfo) {
		this.container = document.createElement('aside');
		this.container.classList.add('thumbs-grid');
		this.totalRatio = Number.POSITIVE_INFINITY;
		this.columnCount = this.getColumnCount();
	}

	getColumnCount() {
		let w = window.innerWidth;
		if (w >= 1280) return 6;
		if (w >= 980) return 5;
		if (w >= 768) return 4;
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
class GalleryImage {

	constructor(info, index) {
		this.info = info;
		this.index = index;
		this.aspectRatio = Number((this.info.width / this.info.height).toFixed(2));
		this.main = null;
		this.thumb = null;
	}

	getThumbSize(sizeFactor) {
		let totalSize = this.aspectRatio * sizeFactor;
		if (totalSize > 700) return 980;
		//if (totalSize > 500) return 640;
		return 320;
	}

	getMainSize() {
		if (this.aspectRatio > 2 && this.info.height > 600) return 1960;
		return 980;
	}

	getTestSrc() {
		return `img/slideshow/${this.info.filename}`;
	}

	getSrc(albumName, size) {
		return app.config.IS_LOCAL ? this.getTestSrc() : app.imageUrl(this.info.filename, albumName, size);
	}

	getOriginalSrc(albumName) {
		return this.getSrc(albumName, undefined);
	}

	getMainSrc(albumName, sizeFactor) {
		return this.getSrc(albumName, this.getMainSize(sizeFactor));
	}

	getThumbSrc(albumName, sizeFactor) {
		return this.getSrc(albumName, this.getThumbSize(sizeFactor));
	}

	createLink(albumName) {
		let a = document.createElement('a');
		a.className = 'fade fade-out';
		a.dataset.index = this.index;
		a.dataset.aspectRatio = this.aspectRatio;
		a.href = this.getOriginalSrc(albumName);
		a.appendChild(this.thumb);
		this.link = a;
	}

}

GalleryImage.create = function(info, index) {
	return new GalleryImage(info, index);
};
(function($) {

	app.load(function() {
		app.gallery = new Gallery(document.querySelector('.slideshow'));
		app.gallery.load();
	});

})(jQuery);
