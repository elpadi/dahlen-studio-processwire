(function($) {

	$.featherlightGallery.prototype.previousIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid"><path fill="white" d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" style="transform:translateX(22.5%)"/><path fill="none" d="M0 0h24v24H0z"/></svg>`;
	$.featherlightGallery.prototype.nextIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid"><path fill="white" d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z"/><path fill="none" d="M0 0h24v24H0z"/></svg>`;

	app.init(function() {
		app.gallery = new Gallery(document.querySelector('.slideshow'));
	});

})(jQuery);
