(function($) {
	var $main = $('#main-content');
	var $stills = $('.slideshow');
	var $motions = $('.motion');

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

	var resizeImage = function(node, dims) {
		var c = contain({ w: parseInt(node.dataset.width, 10), h: parseInt(node.dataset.height, 10) }, dims);
		node.style.width = c.w + 'px';
		node.style.height = c.h + 'px';
	};

	var resizeSlideshow = function(node, images) {
		var c, max = { w: parseInt(node.dataset.width, 10), h: parseInt(node.dataset.height, 10) }, v = { w: $main.width(), h: document.documentElement.clientHeight - 198 };
		if (!node.classList.contains('slideshow')) {
			c = contain(max, v);
			c.w = Math.min(c.w, max.w);
			c.h = Math.min(c.h, max.h);
		}
		else c = v;
		node.style.width = c.w + 'px';
		node.style.height = c.h + 'px';
		images.forEach(function(img) { resizeImage(img, c); });
	};

	var onResize = function() {
		$stills.each(function() { resizeSlideshow(this, Array.from(this.getElementsByTagName('a'))); });
		$motions.each(function() { resizeSlideshow(this, [this.getElementsByTagName('img')[0]]); });
	}
	$(window).on('resize', onResize);

	var showMenu = function() {
		$('#logo').add($('#main-menu > ul > li > ul > li'))
		.each(function(i, el) {
			setTimeout(function() { el.style.opacity = '1'; el.classList.add('color--normal'); }, i * 800);
		});
	};

	$(document).ready(function() {
		if (document.body.classList.contains('template--basic-page'))
			$('.page-title')
			.add('#main-content')
			.add($('#main-content').children())
			.each(function(i, el) {
				setTimeout(function() { el.style.opacity = ('opacity' in el.dataset) ? el.dataset.opacity : '1'; }, i * 100);
			});
		onResize();
		if (document.body.classList.contains('template--home')) {
			var bed = Motion.list.head().data;
			setTimeout(function() {
				Motion.AUTOPLAY_DELAY = 9000;
				bed.dom_node.style.opacity = 1;
				bed.init();
			}, 2000);
			bed.getPromise('finished').then(function() {
				document.getElementById('main-menu').classList.add('intro-colors');
				setTimeout(showMenu, 5000);
				setTimeout(function() { document.getElementById('main-menu').classList.remove('intro-colors'); }, 11000);
			});
		}
	});

})(jQuery);
