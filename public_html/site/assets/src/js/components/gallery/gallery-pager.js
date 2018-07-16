class GalleryPager extends InfiniteScrollPager {

	constructor(imageInfo, imagesPerPage, gallery) {
		super(Math.ceil(imageInfo.length / imagesPerPage));
		this.currentPage = 1;
		this.imageInfo = imageInfo;
		this.imagesPerPage = imagesPerPage;
		this.gallery = gallery;
	}

	content() {
		let i = this.currentPage * this.imagesPerPage;
		let infos = this.imageInfo.slice(i, i + this.imagesPerPage);
		let urls = infos.map(info => {
			let size = 320;
			if (('width' in info) && info.width / info.height > 2) size = 980;
			return {
				url: app.imageUrl(info.filename, this.gallery.node.dataset.name),
				thumb: {
					url: app.imageUrl(info.filename, this.gallery.node.dataset.name, size)
				}
			};
		});
		return this.gallery.addImages(urls);
	}

}
