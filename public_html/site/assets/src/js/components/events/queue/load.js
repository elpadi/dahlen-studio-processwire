class LoadQueue extends EventQueue {

	attachEventHandler() {
		window.addEventListener('load', this.runQueue.bind(this));
	}
	
}
