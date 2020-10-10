class MusicPlaylist {

    constructor(urls, muter)
    {
        this.urls = urls;
        this.index = 0;
        this.muter = muter;
        this.createAudio();
        console.log('MusicPlaylist.constructor', urls);
    }

    createAudio()
    {
        this.audio = new buzz.sound(this.urls[this.index], {
            formats: ['ogg','mp3'],
            autoplay: false,
            volume: 0,
            preload: true,
            loop: false
        });
        this.muter.setAudio(this.audio);
        this.audio.bind('ended', this.next.bind(this));
    }

    stop()
    {
        this.muter.hideButtonTimeout.reset();
        console.log('MusicPlaylist.stop');
        return new Promise((resolve) => {
            this.audio.fadeOut(MusicPlaylist.FADE_DURATION, resolve);
        });
    }

    play(index)
    {
        console.log('MusicPlaylist.play', index);
        if (index === undefined) {
            index = this.index;
        }
        if (index === this.index && !this.audio.isPaused()) {
            return;
        }
        this.muter.showButton();
        if (this.audio.isPaused()) {
            if (index !== this.index) {
                this.createAudio();
            }
            this.audio.setVolume(0).play().fadeIn(MusicPlaylist.FADE_DURATION);
            this.index = index;
        } else {
            this.stop().then(this.play.bind(this, index));
        }
    }

    next()
    {
        if (this.index < this.urls.length - 1) {
            this.play(this.index + 1);
        }
    }

}

MusicPlaylist.FADE_DURATION = 5000;
