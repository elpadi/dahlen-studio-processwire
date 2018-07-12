class Music {

	constructor() {
		this.playlist = {};
		this.hideMuteTimeoutId = 0;
		this.baseUrl = app.config.ASSETS_URL + 'slideshows/';
		this.muter = new MusicMuter();
		for (let n of document.querySelectorAll('[data-music]')) {
			if (n.dataset.music && 'name' in n.dataset) {
				let urls = n.dataset.music.split(' ').map(s => this.baseUrl + n.dataset.name + '/' + s);
				this.playlist[n.dataset.name] = new MusicPlaylist(urls, this.muter);
			}
		}
	}

	play(name) {
		if (name in this.playlist) this.playlist[name].play(0);
	}

}
