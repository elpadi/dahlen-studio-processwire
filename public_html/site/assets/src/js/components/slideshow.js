class Gallery {

	constructor() {
		this.initialSetup();
		this.pagesLoaded = 1;
		this.isFetchingImages = false;
	}

	initialSetup() {
		let gallery = document.querySelector('.gallery');
		if (!gallery) throw "Could not find the gallery element in the DOM.";
		$(gallery).justifiedGallery({
			rowHeight : 150,
			lastRow : 'nojustify',
			margins : 8
		});
		this.onWindowScroll = _.throttle(_.bindKey(this, 'checkScroll'), 300);
		window.addEventListener('scroll', this.onWindowScroll);
		$.featherlight.defaults.afterContent = this.onSliderChange.bind(this);
	}

	onScrollDown() {
		if (this.isFetchingImages || this.pagesLoaded >= app.config.SLIDESHOW_PAGE_COUNT) {
			window.removeEventListener('scroll', this.onWindowScroll);
			return;
		}
		console.log('Gallery.onScrollDown');
		this.isFetchingImages = true;
		this.pagesLoaded++;
		fetch(Gallery.THUMBS_URL)
			.then(response => response.json())
			.then(this.addImages.bind(this));
	}

	checkScroll() {
		if (window.scrollY >= document.body.scrollHeight - window.innerHeight) this.onScrollDown();
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
		loader.loadAll().then(() => $('.gallery').justifiedGallery('norewind'));
	}

	onSliderChange() {
		console.log('Gallery.onSliderChange');
		let img = document.querySelector('.featherlight-image');
		img.dataset.action = 'zoom';
		$(img.parentNode).zoom({ url: img.src });
	}

}

Gallery.THUMBS_URL = '/sample-gallery/images.php';

(function($) {

	app.init(function() {
		app.gallery = new Gallery();
	});

})(jQuery);
