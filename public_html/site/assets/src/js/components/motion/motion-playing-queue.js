class MotionPlayingQueue extends MotionQueue {

	start(motion) {
		motion.onPlayButtonClick();
	}

	setupRelay(cur, next) {
		Promise.all([
			cur.when('finished').then(_.bindKey(cur, 'remove')),
			next.when('buffered')
		]).then(_.bindKey(next, 'onPlayButtonClick'));
	}

}
