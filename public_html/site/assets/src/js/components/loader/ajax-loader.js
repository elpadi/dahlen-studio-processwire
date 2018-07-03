class AjaxLoader {
	
	constructor(baseUrl) {
		this.baseUrl = baseUrl;
		this.isBusy = false;
	}

	fetch() {
		if (this.isBusy) return Promise.reject("Must wait for the current page to finish.");
		this.isBusy = true;
		return window.fetch(this.getUrl()).then(this.onResponse.bind(this));
	}

	getUrl() {
		throw new Error("Method must be implemented by a subclass.");
	}

	onResponse(response) {
		return response.json();
	}

	done() {
		this.isBusy = false;
	}

	content() {
		return this.fetch();
	}

}
