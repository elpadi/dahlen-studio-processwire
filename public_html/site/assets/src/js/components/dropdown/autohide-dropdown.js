class AutohideDropdown extends Dropdown {

	constructor(node) {
		super(node);
	}

	setupAutoHide() {
		this.autoHide = new TimeoutEventEmitter('autohide', Dropdown.AUTOHIDE_DURATION);
		this.autoHide.on('autohide', this.hideAll.bind(this));
		this.node.addEventListener('mouseleave', _.bindKey(this.autoHide, 'reset'));
		for (let s of this.submenus) {
			s.node.addEventListener('mouseenter', _.bindKey(this.autoHide, 'clear'));
		}
	}

	setupSubMenus() {
		super.setupSubMenus();
		this.setupAutoHide();
	}

	onChange() {
		this.autoHide.clear();
	}

}
