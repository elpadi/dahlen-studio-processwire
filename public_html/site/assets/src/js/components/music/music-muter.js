class MusicMuter {

	constructor() {
		this.hideButtonTimeout = new ResettableTimeout(MusicMuter.HIDE_MUTE_TIMEOUT_DURATION, this.hideButton.bind(this));
		this.muteButton = document.getElementById('sound-button');
		this.muteButton.addEventListener('click', this.toggleMute.bind(this));
	}

	setAudio(audio) {
		this.audio = audio;
		this[Number(Cookies.get(MusicMuter.COOKIE_NAME)) ? 'mute' : 'unmute'].call(this);
	}

	muteState(state) {
		this.muteButton.classList.add('state--' + state);
		this.muteButton.classList.remove('state--' + (state == 'on' ? 'off' : 'on'));
	}

	mute() {
		console.log('MusicMuter.mute');
		this.audio.muted = true;
		this.muteState('off');
	}

	unmute() {
		console.log('MusicMuter.unmute');
		this.audio.muted = false;
		this.muteState('on');
	}

	isMuted() {
		return this.audio.muted;
	}

	updateMuteCookie() {
		Cookies.set(MusicMuter.COOKIE_NAME, String(Number(this.audio.muted)), { expires: 365 });
	}

	toggleMute() {
		console.log('MusicPlaylist.toggleMute');
		if ('audio' in this) {
			this[this.isMuted() ? 'unmute' : 'mute'].call(this);
			this.updateMuteCookie();
		}
	}

	hideButton() {
		document.body.classList.remove('music-playing');
	}

	showButton() {
		document.body.classList.add('music-playing');
	}

}

MusicMuter.HIDE_MUTE_TIMEOUT_DURATION = 2000;
MusicMuter.COOKIE_NAME = 'is_sound_muted';
