class DropdownSubmenu {

	constructor(node, dropdown) {
		this.node = node;
		this.dropdown = dropdown;
		node.previousSibling.addEventListener('click', this.toggle.bind(this));
		this.setupMouseHover();
	}

	isOpen() {
		return this.node.classList.contains('open');
	}

	updateClass(method) {
		this.node.classList[method]('open');
		this.dropdown.hideAll(this.node);
		this.dropdown.onChange();
	}

	open() {
		this.updateClass('add');
	}

	toggle(e) {
		if (e) e.preventDefault();
		this.updateClass('toggle');
	}

	close() {
		this.updateClass('remove');
	}

	setupMouseHover() {
		this.node.previousSibling.addEventListener('mouseenter', this.open.bind(this));
	}

}
