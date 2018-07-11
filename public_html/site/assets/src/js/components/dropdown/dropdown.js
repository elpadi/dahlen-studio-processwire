class Dropdown {

	constructor(node) {
		this.menu = node;
		this.setupSubMenus();
	}

	setupSubMenus() {
		let uls = Array.from(this.menu.querySelectorAll('ul'));
		this.submenus = uls.map(ul => new DropdownSubmenu(ul, this));
		let h = Math.max.apply(window, uls.map(ul => ul.offsetHeight)) + MainMenu.VERTICAL_PADDING;
		this.menu.style.height = h + 'px';
	}

	getSubmenuFromTrigger(node) {
		if (node.nodeName !== 'A') return null;
		return node.nextElementSibling ? new DropdownSubmenu(node.nextElementSibling) : null;
	}

	hasSubmenuOpen() {
		return this.menu.querySelectorAll('.open').length > 0;
	}

	hideAll(skip) {
		for (let n of this.menu.querySelectorAll('.open')) if (n != skip) n.classList.remove('open');
		if (!skip) this.onChange();
	}

	onChange() {
	}

}
