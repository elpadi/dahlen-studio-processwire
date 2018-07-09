.PHONY: all js css

JS_MOTION := $(shell find src/js/components/motion -type f -not -name '*.min.js' | awk '{ print length, $$0 }' | sort -n -s | cut -d" " -f2- | sed 's/\.js/\.min.js/')
JS_INTRO := $(shell find src/js/components/intro -type f -not -name '*.min.js' | awk '{ print length, $$0 }' | sort -n -s | cut -d" " -f2- | sed 's/\.js/\.min.js/')
JS_EVENTS := $(shell find src/js/components/events -type f -not -name '*.min.js' | awk '{ print length, $$0 }' | sort -n -s | cut -d" " -f2- | sed 's/\.js/\.min.js/')
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

########################################################################
## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## 
dist/base.js: vendor/jquery.min.js vendor/lodash.min.js src/js/app.min.js
	cat $^ > $@

dist/gallery_vendor.js: vendor/jquery.justifiedGallery.min.js vendor/featherlight.min.js vendor/featherlight.gallery.min.js vendor/jquery.zoom.min.js
	cat $^ > $@

dist/loader.js: $(JS_EVENTS) $(JS_LOADER)
	cat $^ > $@

dist/gallery.js: dist/gallery_vendor.js dist/loader.js $(JS_PAGER) $(JS_GALLERY)
	cat $^ > $@

dist/slideshow.js: dist/gallery.js src/js/components/slideshow.min.js
	cat $^ > $@

dist/motion.js: vendor/doubly-linked-list.min.js src/js/components/maths/rect.min.js dist/loader.js $(JS_MOTION) src/js/templates/motion.min.js
	cat $^ > $@

dist/home.js: dist/motion.js $(JS_INTRO) src/js/templates/home.js
	cat $^ > $@
## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## 
########################################################################

########################################################################
## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## 
dist/base.css: vendor/normalize.min.css $(patsubst %.css, %.min.css, $(shell find src/css/base -type f -not -name '*.min.css')) src/css/components/menu.min.css src/css/main.min.css
	cat $^ > $@

dist/gallery_vendor.css: vendor/justifiedGallery.min.css vendor/featherlight.min.css vendor/featherlight.gallery.min.css vendor/jquery.zoom.min.css
	cat $^ > $@

dist/images.css: dist/gallery_vendor.css src/css/components/slideshow.min.css src/css/templates/images.min.css
	cat $^ > $@

dist/motion.css: src/css/components/motion.min.css
	cat $^ > $@

## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## 
########################################################################
