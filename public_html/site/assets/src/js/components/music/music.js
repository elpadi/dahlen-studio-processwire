class Music {

    constructor(muter)
    {
        this.playlist = {};
        this.hideMuteTimeoutId = 0;
        this.baseUrl = app.config.ASSETS_URL + 'slideshows/';
        this.muter = muter;
        this.currentPlaylist = undefined;
        for (let n of document.querySelectorAll('[data-music]')) {
            if (n.dataset.music && 'name' in n.dataset) {
                let urls = n.dataset.music.split(' ').map(s => this.baseUrl + n.dataset.name + '/' + s);
                this.playlist[n.dataset.name] = new MusicPlaylist(urls, this.muter);
            }
        }
    }

    stop()
    {
        if (this.currentPlaylist) {
            this.playlist[this.currentPlaylist].stop();
        }
        this.currentPlaylist = undefined;
    }

    play(name)
    {
        if (name in this.playlist) {
            if (!this.currentPlaylist || name == this.currentPlaylist) {
                this.playlist[name].play();
            } else {
                this.playlist[this.currentPlaylist].stop().then(this.play.bind(this, name));
            }
            this.currentPlaylist = name;
        }
    }

}
