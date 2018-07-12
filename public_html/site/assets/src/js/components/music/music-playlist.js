class MusicPlaylist {

	constructor(urls, muter) {
		this.urls = urls;
		this.index = 0;
		this.muter = muter;
		this.createAudio();
		console.log('MusicPlaylist.constructor', urls);
	}

	play(index) {
		this.playIndex(index !== undefined ? index : this.index);
	}

	getSupportedType() {
		for (let t of MusicPlaylist.TYPES) if (this.audio.canPlayType('audio/' + t)) return t;
		throw new Error("Cannot play any supported type.");
	}

	stop() {
		this.muter.hideButtonTimeout.reset();
		if ('audio' in this) {
			console.log('MusicPlaylist.stop');
			this.audio.pause();
			delete this.audio;
		}
	}

	createAudio() {
		this.audio = new Audio();
		this.audio.src = this.urls[this.index] + '.' + this.getSupportedType();
		this.muter.setAudio(this.audio);
		this.audio.addEventListener('ended', this.next.bind(this));
	}

	reset() {
		this.stop();
		this.createAudio();
	}

	playIndex(index) {
		console.log('MusicPlaylist.playIndex', index);
		if (index !== this.index) {
			this.index = index;
			this.reset();
		}
		this.audio.play();
		this.muter.hideButtonTimeout.clear();
		this.muter.showButton();
	}

	next() {
		console.log('MusicPlaylist.next');
		this.stop();
		if (this.index < this.urls.length - 1) this.playIndex(this.index + 1);
	}

}

MusicPlaylist.TYPES = ['ogg','mp3'];
