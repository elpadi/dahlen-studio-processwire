class GalleryPager extends InfiniteScrollPager {

	constructor(imageInfo, imagesPerPage, gallery) {
		super(Math.ceil(imageInfo.length / imagesPerPage));
		this.currentPage = 1;
		this.imageInfo = imageInfo;
		this.imagesPerPage = imagesPerPage;
		this.gallery = gallery;
	}

	content() {
		let begin = this.currentPage * this.imagesPerPage;
		let end = begin + this.imagesPerPage - 1;
		console.log('GalleryPager.content', begin, end);
		let infos = this.imageInfo.slice(begin, end);
		if (app.config.IS_LOCAL) {
			let t = Date.now();
			let urls = infos.map(url => {
				return {
					url: url + '?t=' + t,
					thumb: {
						url: url
					}
				};
			});
			return this.gallery.addImages(urls);
		}
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
