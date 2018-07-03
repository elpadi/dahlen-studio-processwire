class InfiniteScrollPager extends Pager {
	
	constructor(pageCount) {
		super(pageCount);
	}

	isScrolledBottom() {
		return window.scrollY >= document.body.scrollHeight - window.innerHeight;
	}

	onScrollBottom() {
		console.log('InfiniteScrollPager.onScrollBottom');
		return this.next();
	}

	onScroll() {
		this.isScrolledBottom() && this.onScrollBottom();
	}

	enable() {
		this.onWindowScroll = _.throttle(_.bindKey(this, 'onScroll'), 300);
		window.addEventListener('scroll', this.onWindowScroll);
	}

	disable() {
		window.removeEventListener('scroll', this.onWindowScroll);
	}

}
