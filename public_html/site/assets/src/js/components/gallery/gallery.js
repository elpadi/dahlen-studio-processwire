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
		$.featherlight.defaults.afterContent = this.onSliderChange.bind(this);
	}

	addImage(image, index, images) {
		console.log('Gallery.addImage', index);
		let a = document.createElement('a');
		a.href = images[index].url;
		a.appendChild(image);
		document.querySelector('.gallery').appendChild(a);
	}

	addImages(images) {
		console.log('Gallery.addImages', images);
		let loader = new ImageLoader(_.map(images, 'thumb.url'));
		loader.events.addEventListener('imageloaded', e => this.addImage(e.detail.image, e.detail.index, images));
		return loader.loadAll().then(() => {
			$('.gallery').justifiedGallery('norewind');
		});
	}

	onSliderChange() {
		console.log('Gallery.onSliderChange');
		let img = document.querySelector('.featherlight-image');
		img.dataset.action = 'zoom';
		$(img.parentNode).zoom({ url: img.src });
	}

}
