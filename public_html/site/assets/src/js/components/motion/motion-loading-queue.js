class MotionLoadingQueue extends MotionQueue {

    startItem(motion)
    {
        console.log('MotionLoadingQueue.startItem', motion.node.id);
        motion.init();
        return Promise.resolve(true);
    }

    whenFinished(cur, next)
    {
        console.log('MotionLoadingQueue.whenFinished', cur.node.id, next.node.id);
        return new Promise(resolve => cur.on('loaded', resolve));
    }

}
