.PHONY: all js css

JS_COMPONENTS := $(shell find src/js/components -type d -mindepth 1 | xargs basename)

DIST_CSS := base images motion jigsaw home
DIST_JS := base slideshow motion heart-collage home

all: css js

css: $(addprefix dist/,$(addsuffix .css,$(DIST_CSS)))

js: $(addprefix dist/,$(addsuffix .component.js,$(JS_COMPONENTS))) $(addprefix dist/,$(addsuffix .js,$(DIST_JS)))

define COMPONENT_template
dist/$(1).component.js: $(addsuffix .min.js,$(basename $(shell find src/js/components/$(1) -type f -not -name '*.min.js' | php sort-component-pieces.php)))
	cat $$^ > $$@

endef

#$(info $(JS_COMPONENTS))
#$(foreach jsc,$(JS_COMPONENTS),$(info $(call COMPONENT_template,$(jsc))))
$(foreach jsc,$(JS_COMPONENTS),$(eval $(call COMPONENT_template,$(jsc))))

%.min.css: %.css
	postcss --use cssnano --no-map -o $@ $^

%.min.js: %.js
	uglifyjs $^ --compress drop_console=true --mangle --output $@

########################################################################
## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## 
dist/base.js: vendor/js.cookie.min.js vendor/jquery.min.js vendor/lodash.min.js vendor/buzz.min.js dist/events.component.js dist/timeouts.component.js dist/music.component.js dist/dropdown.component.js src/js/app.min.js
	cat $^ > $@

dist/gallery_vendor.js: vendor/jquery.justifiedGallery.min.js vendor/featherlight.min.js vendor/featherlight.gallery.min.js
	cat $^ > $@

dist/gallery.js: dist/gallery_vendor.js dist/loader.component.js dist/pager.component.js dist/gallery.component.js
	cat $^ > $@

dist/slideshow.js: dist/gallery.js src/js/templates/slideshow.min.js
	cat $^ > $@

dist/motion.js: vendor/doubly-linked-list.min.js src/js/components/maths/rect.min.js dist/loader.component.js dist/motion.component.js src/js/templates/motion.min.js
	cat $^ > $@

dist/home.js: dist/intro.component.js src/js/templates/home.min.js
	cat $^ > $@

dist/heart-collage.js: vendor/jquery.easing.min.js dist/jigsaw.component.js dist/heart-collage.component.js src/js/templates/heart-collage.min.js
	cat $^ > $@
## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## 
########################################################################

########################################################################
## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## 
dist/base.css: vendor/normalize.min.css $(patsubst %.css, %.min.css, $(shell find src/css/base -type f -not -name '*.min.css')) src/css/components/menu.min.css src/css/components/loader.min.css src/css/main.min.css
	cat $^ > $@

dist/gallery_vendor.css: vendor/justifiedGallery.min.css vendor/featherlight.min.css vendor/featherlight.gallery.min.css
	cat $^ > $@

dist/images.css: dist/gallery_vendor.css src/css/components/slideshow.min.css src/css/components/motion.min.css src/css/templates/images.min.css
	cat $^ > $@

dist/motion.css: src/css/templates/images.min.css src/css/components/motion.min.css
	cat $^ > $@

dist/jigsaw.css: src/css/components/jigsaw.min.css
	cat $^ > $@

dist/home.css: src/css/components/intro.min.css
	cat $^ > $@

## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## 
########################################################################
