class MotionPlayingQueue extends MotionQueue {

	startItem(motion) {
		console.log('MotionPlayingQueue.startItem', motion.node.id);
		motion.node.style.opacity = 1;
		return Promise.delay(MotionPlayingQueue.TRANSITION_DELAY, _.bindKey(motion, 'onPlayButtonClick'));
	}

	whenFinished(cur, next) {
		return Promise.all([
			cur.when('finished').then(_.bindKey(cur, 'remove')).then(Promise.delay(MotionPlayingQueue.TRANSITION_DELAY)),
			next.when('buffered')
		]);
	}

}

MotionPlayingQueue.TRANSITION_DELAY = 2000;
