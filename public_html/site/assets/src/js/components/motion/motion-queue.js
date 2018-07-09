class MotionQueue {

	constructor(motions) {
		this.list = new DLL.DoublyLinkedList();
		for (let m of motions) this.list.append(m);
		this.start(this.list.item(0).data);
		// on finished
		//if (Motion.list.size() === 1) Music.stop();
		// on started
		//setTimeout(function() { Music.play(this.sounds); }.bind(this), parseInt(this.dom_node.dataset.musicDelay, 10));
	}

	setupRelays() {
		let item = this.list.first;
		while (item.next) {
			let cur = item.data;
			let next = item.next.data;
			this.setupRelay(cur, next);
			item = item.next;
		}
	}

	start(motion) {
		throw new Error("Method must be implemented by a subclass.");
	}

	setupRelay(cur, next) {
		throw new Error("Method must be implemented by a subclass.");
	}

}
