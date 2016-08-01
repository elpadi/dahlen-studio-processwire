(function($) {

	var contain = function(inner, outer) {
		var c = {};
		inner.r = inner.w / inner.h;
		outer.r = outer.w / outer.h;
		if (inner.r > outer.r) {
			c.w = outer.w;
			c.h = Math.round(outer.w / inner.r);
		}
		else {
			c.w = Math.round(outer.h * inner.r);
			c.h = outer.h;
		}
		return c;
	};

	var center = function(inner, outer) {
		return {
			x: Math.round((outer.w - inner.w) / 2),
			y: Math.round((outer.h - inner.h) / 2)
		};
	};

	$(document).ready(function() {
		$('.slideshow').each(function() {
			var $s = $(this);
			var $nav = $s.find('nav > button'),
					w = $s.width();
			var h = Math.max($(window).height() - 200, w * (9 / 16));
			$s.find('a').each(function(i, el) {
				var dims = contain({ w: parseInt(this.dataset.width, 10), h: parseInt(this.dataset.height, 10) }, { w: w, h: h });
				var pos = center(dims, { w: w, h: h });
				$(this).css({
					width: dims.w + 'px',
					height: dims.h + 'px',
					left: pos.x + 'px',
					top: pos.y + 'px'
				});
			});
			$s.css({ height: h + 'px' });
			setTimeout(function() { $s.find('.images').slick({
				prevArrow: $nav.first(),
				nextArrow: $nav.last()
			}); }, 100);
		});
	});
})(jQuery);
