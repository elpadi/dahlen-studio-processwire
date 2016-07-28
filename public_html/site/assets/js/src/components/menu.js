(function($) {
	$(document).ready(function() {
		var $menu = $('#main-menu').find('a').first().siblings('ul');
		var $submenus = $menu.find('a + ul');

		/* Make the menu tall enough to show every submenu item */
		$menu.css('height', ($menu.height() + Math.max.apply(window, $menu.find('ul').map(function(i, ul) { return ul.offsetHeight; })) + 20) + 'px');

		$(document).on('click', function(e) {
			if (!$menu.get(0).contains(e.target)) $submenus.removeClass('open');
		});

		$menu.on('click', 'a', function(e) {
			var $button = $(this);
			if ($button.next().is('ul')) {
				e.preventDefault();
				$submenus.not($button.next()).removeClass('open');
				$button.next().toggleClass('open');
			}
		});

	});
})(jQuery);

