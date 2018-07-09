class MotionLoadingQueue extends MotionQueue {

	start(motion) {
		motion.init();
	}

	setupRelay(cur, next) {
		cur.on('loaded', _.bindKey(next, 'init'));
	}

}
