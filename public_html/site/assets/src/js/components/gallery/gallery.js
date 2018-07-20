class Gallery {

	constructor(node) {
		this.node = node;
		this.galleryNode = node.children[0];
		this.initialSetup();
		this.pager = new GalleryPager(window[this.node.dataset.name], this.galleryNode.getElementsByTagName('a').length, this);
		if (document.body.scrollHeight < window.innerHeight * 1.6) this.pager.next();
		app.music.play(this.node.dataset.name);
	}

	initialSetup() {
		$(this.galleryNode).justifiedGallery({
			rowHeight : 150,
			lastRow : 'nojustify',
			margins : 8
		});
		$.featherlight.defaults.beforeContent = this.beforeSliderContent.bind(this);
		$.featherlight.defaults.afterContent = this.afterSliderContent.bind(this);
	}

	addImage(image, index, images) {
		console.log('Gallery.addImage', index, image.src.split('/').pop());
		let a = document.createElement('a');
		a.href = images[index].url;
		a.appendChild(image);
		document.querySelector('.gallery').appendChild(a);
	}

	addImages(images) {
		console.log('Gallery.addImages', images);
		let loader = new ImageLoader(_.map(images, 'thumb.url'));
		this.galleryNode.classList.add('loading');
		loader.events.addEventListener('imageloaded', e => this.addImage(e.detail.image, e.detail.index, images));
		return loader.loadAll().then(() => {
			this.galleryNode.classList.remove('loading');
			requestAnimationFrame(() => $('.gallery').justifiedGallery('norewind'));
		});
	}

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

}
