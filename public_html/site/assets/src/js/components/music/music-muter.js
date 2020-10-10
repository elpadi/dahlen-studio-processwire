class MusicMuter {

    constructor()
    {
        this.hideButtonTimeout = new ResettableTimeout(MusicPlaylist.FADE_DURATION + 1000, this.hideButton.bind(this));
        this.muteButton = document.getElementById('sound-button');
        this.muteButton.addEventListener('click', this.toggleMute.bind(this));
    }

    setAudio(audio)
    {
        this.audio = audio;
        this[Number(Cookies.get(MusicMuter.COOKIE_NAME)) ? 'mute' : 'unmute'].call(this);
    }

    buttonState(state)
    {
        this.muteButton.classList.add('state--' + state);
        this.muteButton.classList.remove('state--' + (state == 'on' ? 'off' : 'on'));
    }

    mute()
    {
        console.log('MusicMuter.mute');
        this.audio.mute();
        this.buttonState('off');
    }

    unmute()
    {
        console.log('MusicMuter.unmute');
        this.audio.unmute();
        this.buttonState('on');
    }

    isMuted()
    {
        return this.audio.isMuted();
    }

    updateMuteCookie()
    {
        Cookies.set(MusicMuter.COOKIE_NAME, String(Number(this.isMuted())), { expires: 365 });
    }

    toggleMute()
    {
        console.log('MusicPlaylist.toggleMute');
        if ('audio' in this) {
            this[this.isMuted() ? 'unmute' : 'mute'].call(this);
            this.updateMuteCookie();
        }
    }

    hideButton()
    {
        this.hideButtonTimeout.clear();
        document.body.classList.remove('music-playing');
    }

    showButton()
    {
        this.hideButtonTimeout.clear();
        document.body.classList.add('music-playing');
    }

}

MusicMuter.COOKIE_NAME = 'is_sound_muted';
