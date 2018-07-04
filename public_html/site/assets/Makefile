.PHONY: all js css

JS_LOADER := $(shell find src/js/components/loader -type f -not -name '*.min.js' | awk '{ print length, $$0 }' | sort -n -s | cut -d" " -f2- | sed 's/\.js/\.min.js/')
JS_PAGER := $(shell find src/js/components/pager -type f -not -name '*.min.js' | awk '{ print length, $$0 }' | sort -n -s | cut -d" " -f2- | sed 's/\.js/\.min.js/')
JS_GALLERY := $(shell find src/js/components/gallery -type f -not -name '*.min.js' | awk '{ print length, $$0 }' | sort -n -s | cut -d" " -f2- | sed 's/\.js/\.min.js/')

all: css js

css: dist/base.css dist/images.css

js: dist/base.js dist/slideshow.js

%.min.css: %.css
	postcss --use cssnano --no-map -o $@ $^

%.min.js: %.js
	uglifyjs $^ --compress drop_console=true --mangle --output $@

dist/base.js: vendor/jquery.min.js vendor/lodash.min.js src/js/app.min.js
	cat $^ > $@

dist/gallery_vendor.js: vendor/jquery.justifiedGallery.min.js vendor/featherlight.min.js vendor/featherlight.gallery.min.js vendor/jquery.zoom.min.js
	cat $^ > $@

dist/slideshow.js: dist/gallery_vendor.js $(JS_LOADER) $(JS_PAGER) $(JS_GALLERY) src/js/components/slideshow.min.js
	cat $^ > $@

dist/base.css: vendor/normalize.min.css $(patsubst %.css, %.min.css, $(shell find src/css/base -type f -not -name '*.min.css')) src/css/components/menu.min.css src/css/main.min.css
	cat $^ > $@

dist/gallery_vendor.css: vendor/justifiedGallery.min.css vendor/featherlight.min.css vendor/featherlight.gallery.min.css vendor/jquery.zoom.min.css
	cat $^ > $@

dist/images.css: dist/gallery_vendor.css src/css/components/slideshow.min.css src/css/templates/images.min.css
	cat $^ > $@
