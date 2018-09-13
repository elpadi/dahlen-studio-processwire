class GalleryImage {

	constructor(info, index) {
		this.info = info;
		this.index = index;
		this.aspectRatio = Number((this.info.width / this.info.height).toFixed(2));
		this.main = null;
		this.thumb = null;
	}

	getThumbSize() {
		let avgH = 200;
		return app.getValidImageSize(this.aspectRatio * avgH, avgH, app.MIN_IMG_SIZE);
	}

	getMainSize() {
		let h = window.innerHeight - 237;
		return app.getValidImageSize(this.aspectRatio * h, h, app.MAX_IMG_SIZE);
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
		a.className = 'fade';
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
