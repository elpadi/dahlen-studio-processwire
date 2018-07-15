class MotionQueue {

	constructor(motions) {
		this.list = new DLL.DoublyLinkedList();
		for (let m of motions) this.list.append(m);
		// on finished
		//if (Motion.list.size() === 1) Music.stop();
		// on started
		//setTimeout(function() { Music.play(this.sounds); }.bind(this), parseInt(this.dom_node.dataset.musicDelay, 10));
	}

	setupRelays() {
		let item = this.list.head();
		while (item.next) {
			let cur = item.data;
			let next = item.next.data;
			this.setupRelay(cur, next);
			item = item.next;
		}
	}

	setupRelay(cur, next) {
		this.whenFinished(cur, next).then(this.start.bind(this, next));
	}

	start(item) {
		return this.startItem(item === undefined ? this.list.head().data : item);
	}

	startItem(item) {
		throw new Error("Method must be implemented by a subclass.");
	}

	whenFinished(cur, next) {
		throw new Error("Method must be implemented by a subclass.");
	}

	clone(constructor) {
		let items = [];
		for (let i = 0, l = this.list.size(); i < l; i++) {
			items.push(this.list.item(i).data);
		}
		return constructor(items);
	}

}

