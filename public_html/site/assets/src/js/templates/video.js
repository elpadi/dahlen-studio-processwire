(function ($) {

    app.load(function () {
        app.videos = {};
        $('#main-content .video').each(function () {
            app.videos[this.id] = new Video(this);
            app.videos[this.id].init();
        });
    });

})(jQuery);
