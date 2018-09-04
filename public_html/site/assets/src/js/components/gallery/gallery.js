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
		let a = document.createElement('a');
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
		this.activeGrid.hydrate(this.images);
	}

	createImageElements() {
		this.images = window[this.name].map(this.createImageElement.bind(this));
	}

	initialSetup() {
		this.createImageElements();
		this.setupThumbGrids();
		/*
		$(this.galleryNode).justifiedGallery({
			rowHeight : 150,
			lastRow : 'nojustify',
			margins : 8
		});
		$.featherlight.defaults.beforeContent = this.beforeSliderContent.bind(this);
		$.featherlight.defaults.afterContent = this.afterSliderContent.bind(this);
		*/
	}

	addImage(image, index, images) {
		/*
		console.log('Gallery.addImage', index, image.src.split('/').pop());
		let a = document.createElement('a');
		a.href = images[index].url;
		a.appendChild(image);
		document.querySelector('.gallery').appendChild(a);
		*/
	}

	addImages(images) {
		/*
		console.log('Gallery.addImages', images);
		let loader = new ImageLoader(_.map(images, 'thumb.url'));
		this.galleryNode.classList.add('loading');
		loader.events.addEventListener('imageloaded', e => this.addImage(e.detail.image, e.detail.index, images));
		return loader.loadAll().then(() => {
			this.galleryNode.classList.remove('loading');
			requestAnimationFrame(() => $('.gallery').justifiedGallery('norewind'));
		});
		*/
	}

	/*
	beforeSliderContent() {
		console.log('Gallery.beforeSliderContent');
		let f = document.querySelector('.featherlight');
		if (!f.querySelector('.loader')) {
			f.appendChild(document.querySelector('.loader').cloneNode(true));
		}
		f.querySelector('.featherlight-content').classList.add('loading');
	}

	afterSliderContent() {
		console.log('Gallery.afterSliderContent');
		let f = document.querySelector('.featherlight-content'),
			img = document.querySelector('.featherlight-image');
		f.classList.remove('loading');
	}
	*/

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
