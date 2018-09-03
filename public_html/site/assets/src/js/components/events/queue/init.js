class InitQueue extends EventQueue {

	attachEventHandler() {
		jQuery(document).ready(this.runQueue.bind(this));
	}
	
}
