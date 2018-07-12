class MainDropdown extends AutohideDropdown {

	constructor(node) {
		super(node);
		document.addEventListener('click', this.onDocumentClick.bind(this));
	}

	updateBodyClass() {
		document.body.classList.toggle('submenu-open', this.hasSubmenuOpen());
	}

	onChange() {
		super.onChange();
		requestAnimationFrame(this.updateBodyClass.bind(this));
	}

	onDocumentClick(e) {
		if (!this.node.contains(e.target)) {
			this.hideAll();
		}
	}

}

MainDropdown.create = function() {
	let node = document.getElementById('main-menu').querySelector('a').nextElementSibling;
	if (!node) throw new Error("Could not find main menu element.");
	return new MainDropdown(node);
};
