class Pager {
	
	constructor(pageCount) {
		this.currentPage = 0;
		this.pageCount = pageCount;
		this.enable();
	}

	next() {
		let promise = this.content.apply(this, arguments);
		promise.then(this.increment.bind(this));
		return promise;
	}

	increment() {
		this.currentPage++;
		if (this.currentPage >= this.pageCount) this.disable();
	}

	enable() {
		throw new Error("Method must be implemented by a subclass.");
	}

	disable() {
		throw new Error("Method must be implemented by a subclass.");
	}

	content() {
		throw new Error("Method must be implemented by a subclass.");
	}

}
