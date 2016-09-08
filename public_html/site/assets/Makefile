CSS_SRC := $(shell find src/css -type f -name '*.css' | grep -v 'main')
JS_SRC := $(shell find src/js -type f -name '*.js' | grep -v 'main')
MUSIC_MP3 := $(shell find slideshows -type f -name '*.wav' | sed 's/\.wav/.mp3/')
MUSIC_OGG := $(shell find slideshows -type f -name '*.wav' | sed 's/\.wav/.ogg/')

CSS_VENDOR := $(shell grep 'link.*bower_components' ../templates/twig/base.html | sed -e 's/.*bower/bower/' -e 's/">//')
JS_VENDOR := $(shell grep 'script.*bower_components' ../templates/twig/base.html | sed -e 's/.*bower/bower/' -e 's/">.*//')

.PHONY: all music css js

all: dist/main.min.css dist/main.min.js music

css: dist/main.min.css

dist/main.css: $(CSS_VENDOR) $(CSS_SRC) src/css/main.css
	cat $^ |  tr -d '\15\32' > $@

dist/main.prefixed.css: dist/main.css
	postcss --use autoprefixer -o $@ $^

dist/main.min.css: dist/main.prefixed.css
	cssnano $^ $@ --safe

js: dist/main.min.js

dist/main.src.js: $(JS_SRC) src/js/main.js
	cat $^ |  tr -d '\15\32' > $@

dist/main.es5.js: dist/main.src.js
	babel -o $@ $^

dist/main.js: $(JS_VENDOR) dist/main.es5.js
	cat $^ |  tr -d '\15\32' > $@

dist/main.min.js: dist/main.js
	uglifyjs $^ -o $@ -c

music: $(MUSIC_MP3) $(MUSIC_OGG)

%.mp3: %.wav
	ffmpeg -i $^ -aq 8 $@

%.ogg: %.wav
	ffmpeg -i $^ -aq 1 $@
