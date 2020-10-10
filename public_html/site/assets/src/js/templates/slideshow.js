(function ($) {

    app.load(function () {
        app.gallery = new Gallery(document.querySelector('.slideshow'));
        app.gallery.load();
    });

})(jQuery);
