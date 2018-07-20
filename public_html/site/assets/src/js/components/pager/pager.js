class Pager {
	
	constructor(pageCount) {
		this.currentPage = 0;
		this.pageCount = pageCount;
		this.enable();
		this.isBusy = false;
	}

	next() {
		if (this.isBusy) return Promise.reject('Pager is busy.');
		console.log('Pager.next');
		this.isBusy = true;
		let promise = this.content.apply(this, arguments);
		promise.then(this.increment.bind(this));
		return promise;
	}

	increment() {
		this.currentPage++;
		if (this.currentPage >= this.pageCount) this.disable();
		else this.isBusy = false;
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
