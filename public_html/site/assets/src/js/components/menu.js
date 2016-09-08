(function($) {
	$(document).ready(function() {
		var $menu = $('#main-menu').find('a').first().siblings('ul');
		var $submenus = $menu.find('a + ul');
		var autohideTimeoutId = 0, isAutohideOn = false;

		/* Make the menu tall enough to show every submenu item */
		$menu.css('height', ($menu.height() + Math.max.apply(window, $menu.find('ul').map(function(i, ul) { return ul.offsetHeight; })) + 20) + 'px');

		var Submenu = {
			open: function($submenu) {
				$submenus.not($submenu).removeClass('open');
				$submenu.addClass('open');
				Submenu.onChange();
			},
			toggle: function($submenu) {
				$submenus.not($submenu).removeClass('open');
				$submenu.toggleClass('open');
				Submenu.onChange();
			},
			close: function($submenu) {
				($submenu ? $submenu : $submenus).removeClass('open');
				Submenu.onChange();
			},
			onChange: function() {
				requestAnimationFrame(function() {
					document.body.classList.toggle('submenu-open', Boolean($submenus.filter('.open').length));
				});
				isAutohideOn = false;
			},
			resumeAutoHide: function() {
				if (isAutohideOn) return;
				autohideTimeoutId = setTimeout(function() {
					console.log('Opened menu left behind. Hiding all');
					Submenu.close();
				}, 1000);
				isAutohideOn = true;
			},
			cancelAutoHide: function() {
				clearTimeout(autohideTimeoutId);
				isAutohideOn = false;
			}
		};

		$(document).on('click', function(e) {
			if (!$menu.get(0).contains(e.target)) {
				Submenu.cancelAutoHide();
				$submenus.removeClass('open');
				document.body.classList.remove('submenu-open');
			}
		});

		$menu.on('touchstart', 'a', function(e) {
			var $button = $(this);
			Submenu.cancelAutoHide();
			if ($button.next().is('ul')) {
				e.preventDefault();
				Submenu.toggle($button.next());
			}
		});

		$submenus.each(function() {
			var $submenu = $(this);
			var $button = $submenu.prev();
			$button.on('mouseenter', function() {
				console.log('Menu button mouse entered', $button.text());
				Submenu.open($submenu);
			});
		});

		$submenus.on('mouseenter', Submenu.cancelAutoHide);
		$menu.on('mouseleave', Submenu.resumeAutoHide);
		$menu.children().children('a').on('mouseover', function() {
			Submenu[this.nextElementSibling ? 'cancelAutoHide' : 'resumeAutoHide'].call(window);
		});

	});
})(jQuery);
