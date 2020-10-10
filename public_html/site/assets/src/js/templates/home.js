(function ($) {
    app.load(function () {
        app.videos = {};
        $('#main-content .video').each(function (i, el) {
            app.videos[this.id] = new Video(this, {
                autoplay: i == 0,
                mute: i == 0,
                playIcon: i > 0
            });
        });
        app.intro = new Intro();
        app.intro.init();
    });
})(jQuery);
