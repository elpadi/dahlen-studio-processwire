window.Music = {
    FADE_DURATION: 5000,
    isPlaying: false,
    play: function (paths) {
        if (!paths.length || document.getElementById('sound-button').classList.contains('state--off')) {
            return;
        }
        buzz.all().stop();
        document.body.classList.add('music-playing');
        console.log('Music.play', paths[0].split('/').pop());
        var sound = new buzz.sound(paths[0], { formats: ['ogg','mp3'], autoplay: true, volume:0, preload: true, loop: false });
        sound.bindOnce('play', function () {
            sound.fadeIn(Music.FADE_DURATION);
        });
        sound.bindOnce('ended', Music.onEnd);
        Music.isPlaying = true;
    },
    stop: function () {
        console.log('Music.stop', 'isPlaying', Music.isPlaying);
        if (Music.isPlaying) {
            buzz.all().fadeOut(Music.FADE_DURATION);
            setTimeout(Music.onEnd, Music.FADE_DURATION);
            Music.isPlaying = false;
        } else {
            Music.onEnd();
        }
    },
    onEnd: function () {
        console.log('Music.onEnd');
        buzz.all().stop();
        document.body.classList.remove('music-playing');
        Music.isPlaying = false;
    }
};

(function ($) {
    var $main = $('#main-content');
    var $stills = $('.slideshow');
    var $motions = $('.motion');

    var contain = function (inner, outer) {
        var c = {};
        inner.r = inner.w / inner.h;
        outer.r = outer.w / outer.h;
        if (inner.r > outer.r) {
            c.w = outer.w;
            c.h = Math.round(outer.w / inner.r);
        } else {
            c.w = Math.round(outer.h * inner.r);
            c.h = outer.h;
        }
        return c.w > inner.w || c.h > inner.h ? inner : c;
    };

    var resizeImage = function (node, dims) {
        var c = contain({ w: parseInt(node.dataset.width, 10), h: parseInt(node.dataset.height, 10) }, dims);
        node.style.width = c.w + 'px';
        node.style.height = c.h + 'px';
    };

    var resizeSlideshow = function (v, node, images) {
        var c = { w: Math.min(parseInt(node.dataset.width, 10), v.w), h: Math.min(parseInt(node.dataset.height, 10), v.h) };
        node.style.width = c.w + 'px';
        node.style.height = c.h + 'px';
        images.forEach(function (img) {
            resizeImage(img, c); });
    };

    var onResize = function () {
        var v = { w: $main.width(), h: document.documentElement.clientHeight - 198 };
        $stills.each(function () {
            resizeSlideshow(v, this, Array.from(this.getElementsByTagName('a'))); });
        $motions.each(function () {
            resizeSlideshow(v, this, [this.getElementsByTagName('img')[0]]); });
    }
    $(window).on('resize', onResize);

    $(document).ready(function () {
        if (document.body.classList.contains('template--basic-page')) {
            $('.page-title')
            .add('#main-content')
            .add($('#main-content').children())
            .each(function (i, el) {
                setTimeout(function () {
                    el.style.opacity = ('opacity' in el.dataset) ? el.dataset.opacity : '1'; }, i * 100);
            });
        }
        onResize();

        document.getElementById('sound-button').addEventListener('click', function (e) {
            buzz.all().togglePlay();
            this.classList.toggle('state--on');
            this.classList.toggle('state--off');
        });
    });

})(jQuery);
