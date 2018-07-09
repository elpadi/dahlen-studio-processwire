class Rect {

	constructor(w, h) {
		this.width = w;
		this.height = h;
		this.ratio = w / h;
	}

	/**
	 * Contain a rect inside the current rect.
	 */
	contain(rect) {
		let c = {};
		if (rect.ratio > this.ratio) {
			c.width = this.width;
			c.height = Math.round(this.width / rect.ratio);
		}
		else {
			c.width = Math.round(this.height * rect.ratio);
			c.height = this.height;
		}
		return Rect.createFromObject(c);
	}

	containBigger(rect) {
		let c = this.contain(rect);
		return c.width > rect.width || c.height > rect.height ? rect : c;
	}

}

Rect.createFromNode = function(node) {
	return new Rect(node.offsetWidth, node.offsetHeight);
};

Rect.createFromObject = function(obj) {
	return new Rect(obj.width, obj.height);
};
