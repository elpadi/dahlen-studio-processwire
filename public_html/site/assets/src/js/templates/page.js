(function ($) {

    var show = function (el) {
        el.style.opacity = ('opacity' in el.dataset) ? el.dataset.opacity : '1'; };
    var $els = $('.page-title').add($('#main-content').children());
    app.init(function () {
        $els.each(function (i, el) {
            setTimeout(show.bind(this, el), i * 100); });
    });

})(jQuery);
