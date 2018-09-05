.PHONY: all js css

JS_COMPONENTS := $(shell find src/js/components -type d -mindepth 1 | xargs basename)

DIST_CSS := base slideshow motion jigsaw home page
DIST_JS := base slideshow motion heart-collage home page

all: css js

css: $(addprefix dist/,$(addsuffix .css,$(DIST_CSS))) $(addprefix dist/,$(addsuffix .min.css,$(DIST_CSS)))

js: $(addprefix dist/,$(addsuffix .component.js,$(JS_COMPONENTS))) $(addprefix dist/,$(addsuffix .js,$(DIST_JS))) $(addprefix dist/,$(addsuffix .min.js,$(DIST_JS)))

define COMPONENT_template
dist/$(1).component.js: $(shell find src/js/components/$(1) -type f -not -name '*.min.js' | php sort-component-pieces.php)
	cat $$^ > $$@

endef

#$(info $(JS_COMPONENTS))
#$(foreach jsc,$(JS_COMPONENTS),$(info $(call COMPONENT_template,$(jsc))))
$(foreach jsc,$(JS_COMPONENTS),$(eval $(call COMPONENT_template,$(jsc))))

%.min.css: %.css
	postcss --use cssnano --no-map -o $@ $^

%.min.js: %.js
	babel $^ | uglifyjs --compress drop_console=true --mangle --output $@

########################################################################
## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## 
dist/base.vendor.js: vendor/js.cookie.min.js vendor/promise-polyfill.min.js vendor/unfetch.umd.js vendor/jquery.min.js vendor/lodash.min.js vendor/buzz.min.js 
	cat $^ > $@

dist/base.js: dist/events.component.js dist/event-queue.component.js dist/timeouts.component.js dist/music.component.js dist/dropdown.component.js src/js/app.js
	cat $^ > $@

dist/base.min.js: dist/base.vendor.js dist/base.js
	cp dist/base.vendor.js $@
	babel dist/base.js | uglifyjs --compress drop_console=true --mangle >> $@

dist/slideshow.js: src/js/components/loader/image-loader.js dist/gallery.component.js src/js/templates/slideshow.js
	cat $^ > $@

dist/motion.js: vendor/doubly-linked-list.min.js src/js/components/maths/rect.js dist/loader.component.js dist/motion.component.js src/js/templates/motion.js
	cat $^ > $@

dist/home.js: dist/intro.component.js src/js/templates/home.js
	cat $^ > $@

dist/heart-collage.js: vendor/jquery.easing.min.js dist/jigsaw.component.js dist/heart-collage.component.js src/js/templates/heart-collage.js
	cat $^ > $@

dist/page.js: src/js/templates/page.js
	cat $^ > $@
## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## ## JS ## 
########################################################################

########################################################################
## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## 
dist/base.css: vendor/normalize.min.css $(shell find src/css/base -type f -not -name '*.min.css') src/css/components/menu.css src/css/components/loader.css src/css/main.css
	cat $^ > $@

dist/slideshow.css: src/css/templates/images.css src/css/components/slideshow.css
	cat $^ > $@

dist/motion.css: src/css/templates/images.css src/css/components/motion.css
	cat $^ > $@

dist/jigsaw.css: src/css/components/jigsaw.css
	cat $^ > $@

dist/home.css: src/css/components/intro.css
	cat $^ > $@

dist/page.css: src/css/templates/basic-page.css
	cat $^ > $@
## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## ## CSS ## 
########################################################################
