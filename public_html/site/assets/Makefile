CSS_SRC := $(shell grep 'stylesheet' ../templates/twig/base.html | grep -v 'not-in-build' | perl -pe 's/.*}}(.*\.css).*/\1/')
JS_SRC := $(shell grep 'script src' ../templates/twig/base.html | grep -v 'not-in-build' | perl -pe 's/.*}}(.*\.js).*/\1/')
MUSIC := $(shell find slideshows -type f -name '*.wav')

.PHONY: all css js music

all: css js music

css: src/css/build.css

js: src/js/build.js

music: $(patsubst %.wav, %.mp3, $(MUSIC)) $(patsubst %.wav, %.ogg, $(MUSIC))

src/css/build.css: $(CSS_SRC)
	cat $^ |  tr -d '\15\32' > $@
	postcss --use postcss-cssnext -o $@ $@
	cssnano $@ $@ --safe

src/js/build.js: $(JS_SRC)
	cat $^ |  tr -d '\15\32' > $@
	#babel -o $@ $^
	uglifyjs $@ -o $@ -c


%.mp3: %.wav
	ffmpeg -i $^ -aq 8 $@

%.ogg: %.wav
	ffmpeg -i $^ -aq 1 $@
