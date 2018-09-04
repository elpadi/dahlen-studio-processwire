class InitEventQueue extends EventQueue {

	attachEventHandler() {
		jQuery(document).ready(this.runQueue.bind(this));
	}
	
}
