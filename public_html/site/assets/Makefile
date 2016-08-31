CSS_SRC := $(shell find src/css/{base,components} -type f)
CSS_VENDOR := $(shell grep 'link.*bower_components' ../templates/twig/base.html | sed -e 's/.*bower/bower/' -e 's/">//')

JS_SRC := $(shell find src/js/components -type f)
JS_VENDOR := $(shell grep 'script.*bower_components' ../templates/twig/base.html | sed -e 's/.*bower/bower/' -e 's/">.*//')

MUSIC_MP3 := $(shell find slideshows -type f -name '*.wav' | sed 's/\.wav/.mp3/')
MUSIC_OGG := $(shell find slideshows -type f -name '*.wav' | sed 's/\.wav/.ogg/')

.PHONY: all music

all: dist/main.min.css dist/main.min.js music

dist/main.css: $(CSS_VENDOR) $(CSS_SRC) src/css/main.css
	cat $^ > $@

dist/main.min.css: dist/main.css
	postcss --use autoprefixer cssnano -o $@ $^

dist/main.js: $(JS_VENDOR) $(JS_SRC) src/js/main.js
	cat $^ > $@

dist/main.min.js: dist/main.js
	uglifyjs $^ -o $@ -c

music: $(MUSIC_MP3) $(MUSIC_OGG)

%.mp3: %.wav
	ffmpeg -i $^ -aq 8 $@

%.ogg: %.wav
	ffmpeg -i $^ -aq 1 $@
