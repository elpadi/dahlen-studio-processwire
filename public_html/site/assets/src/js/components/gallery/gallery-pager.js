class GalleryPager extends InfiniteScrollPager {

	constructor(pageCount, baseUrl, gallery) {
		super(pageCount);
		this.currentPage = 1;
		this.ajax = new ImageListingLoader(baseUrl);
		this.gallery = gallery;
	}

	content(gallery) {
		return this.ajax.fetch()
			.then(_.bindKey(this.gallery, 'addImages'))
			.then(_.bindKey(this.ajax, 'done'));
	}

}
