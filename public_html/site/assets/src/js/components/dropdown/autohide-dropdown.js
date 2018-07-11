class AutohideDropdown extends Dropdown {

	constructor(node) {
		super(node);
		this.autoHide = new TimeoutEventEmitter('autohide', Dropdown.AUTOHIDE_DURATION);
		this.autoHide.on('autohide', this.hideAll.bind(this));
		this.node.addEventListener('mouseenter', this.open.bind(this));
	}

	setupSubMenus() {
		super.setupSubMenus();
		for (let s of this.submenus) {
			s.node.addEventListener('mouseenter', _.bindKey(this.autoHide, 'clear'));
			s.node.addEventListener('mouseleave', _.bindKey(this.autoHide, 'reset'));
		}
	}

	onChange() {
		this.autoHide.clear();
	}

}
