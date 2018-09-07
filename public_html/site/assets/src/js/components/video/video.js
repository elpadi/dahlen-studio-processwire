class Video {

	constructor(element, options) {
		Video.assertVideoElement(element);
		this.element = element;
		this.video = element.querySelector('video');
		$.extend(this, {
			autoplay: false,
			playIcon: true,
			mute: false
		}, options);
	}

	createPlayIcon() {
		this.element.appendChild(app.createIcon('play_arrow'));
	}

	init() {
		if (this.playIcon) this.createPlayIcon();
		if (this.mute) this.video.muted = true;
		this.element.classList.remove('fade-out');
		return new Promise((resolve, reject) => {
			this.video.addEventListener('ended', resolve);
			if (this.autoplay) setTimeout(() => this.video.play(), Video.AUTOPLAY_DELAY);
		});
	}

}

Video.assertVideoElement = function(element) {
	if (!element || element.childElementCount == 0) throw new Error("Invalid video node.");
	let v = element.children[0];
	if (v.nodeName !== 'VIDEO') throw new Error("Invalid video node.");
};

Video.AUTOPLAY_DELAY = 500;
