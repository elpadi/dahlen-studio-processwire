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
