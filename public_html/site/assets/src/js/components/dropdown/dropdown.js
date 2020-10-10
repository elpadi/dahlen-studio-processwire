class Dropdown {

    constructor(node)
    {
        this.node = node;
        this.VERTICAL_PADDING = 2;
        requestAnimationFrame(this.setupSubMenus.bind(this));
    }

    setupSubMenus()
    {
        let uls = Array.from(this.node.querySelectorAll('ul'));
        this.submenus = uls.map(ul => new DropdownSubmenu(ul, this));
        let h = Math.max.apply(window, uls.map(ul => ul.offsetHeight));
        this.node.style.height = `calc(${h}px + ${this.VERTICAL_PADDING}em)`;
    }

    getSubmenuFromTrigger(node)
    {
        if (node.nodeName !== 'A') {
            return null;
        }
        return node.nextElementSibling ? new DropdownSubmenu(node.nextElementSibling) : null;
    }

    hasSubmenuOpen()
    {
        return this.node.querySelectorAll('.open').length > 0;
    }

    hideAll(skip)
    {
        console.log('Dropdown.hideAll', skip);
        for (let n of this.node.querySelectorAll('.open')) {
            if (n != skip) {
                n.classList.remove('open');
            }
        }
        if (!skip) {
            this.onChange();
        }
    }

    onChange()
    {
    }

}
