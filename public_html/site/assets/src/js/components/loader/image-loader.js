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
