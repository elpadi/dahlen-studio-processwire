<?php
define('MINIFY', false);
define('DEBUG', true);
?><!doctype html>
<html class="no-js" lang="">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="x-ua-compatible" content="ie=edge">
		<title>Intro Static Testing</title>
		<meta name="description" content="Work done on behalf of several of the biggest and boldest brands in the fashion and beauty industries.">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" class="not-in-build" href="/site/assets/fonts/definitions.css?v=7">

		<!--**************** BASE **************** -->
		<?php if (MINIFY): ?>
		<link rel="stylesheet" href="/site/assets/dist/base.css">
		<?php else: ?>
		<link rel="stylesheet" href="/site/assets/vendor/normalize.min.css">
		<link rel="stylesheet" href="/site/assets/src/css/base/default.css">
		<link rel="stylesheet" href="/site/assets/src/css/base/classes.css">
		<link rel="stylesheet" href="/site/assets/src/css/base/colors.css">
		<link rel="stylesheet" href="/site/assets/src/css/components/menu.css">
		<link rel="stylesheet" href="/site/assets/src/css/main.css">
		<?php endif; ?>
		<!--**************** BASE **************** -->

		<!--**************** INTRO **************** -->
		<?php if (MINIFY): ?>
		<link rel="stylesheet" href="/site/assets/dist/home.css">
		<?php else: ?>
		<link rel="stylesheet" href="/site/assets/src/css/components/intro.css">
		<?php endif; ?>
		<!--**************** INTRO **************** -->
		<script>document.documentElement.className = 'js';</script>
	</head>
	<body class="page--home template--home theme--white">
		<div id="container">
			<header id="main-header">
				<a id="logo" href="/">
					<svg id="svg2" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1555.925 126.76389" version="1.0" preserveAspectRatio="xMidYMid meet" xmlns:cc="http://creativecommons.org/ns#" height="126.76pt" xmlns:dc="http://purl.org/dc/elements/1.1/">
						<g id="dahlen-studio" transform="matrix(.1 0 0 -.1 -11 141.79)">
							<g id="dahlen">
								<path id="dahlen-d" d="m110 785v-615h309c444 0 548 23 669 148 118 120 156 247 149 492-3 133-8 167-31 237-64 197-202 314-404 343-37 5-208 10-379 10h-313v-615zm591 319c68-20 120-72 140-140 19-65 19-324 1-377-8-21-25-51-39-68-43-51-77-62-200-67l-113-5v337 336h78c43 0 103-7 133-16z"/>
								<path id="dahlen-a" d="m1705 1368c-41-100-445-1182-445-1194 0-11 34-14 190-14h189l21 73c12 39 26 87 31 105l11 32h216 217l30-103 30-102 198-3c108-1 197 0 197 3 0 13-453 1211-463 1223-7 9-61 12-209 12h-199l-14-32zm279-508c32-102 59-193 62-202 5-17-6-18-125-18-72 0-131 3-131 8-1 23 126 419 131 409 4-7 32-95 63-197z"/>
								<path id="dahlen-h" d="m2720 785v-615h190 190v250 250h205 205v-250-250h195 195v615 615h-195-195v-215-215h-205-205v215 215h-190-190v-615z"/>
								<path id="dahlen-l" d="m4150 785v-615h485 485v150 150h-295-295v465 465h-190-190v-615z"/>
								<path id="dahlen-e" d="m5300 785v-615h515 515v140 140h-325-325v120 120h295 295v125 125h-295-295v100 100h315 315v130 130h-505-505v-615z"/>
								<path id="dahlen-n" d="m6540 785v-615h180 180l2 331 3 331 225-331 225-330 183-1h182v615 615h-180-180v-336c0-184-4-333-8-330-5 3-110 154-233 335l-224 330-177 1h-178v-615z"/>
							</g>
							<g id="studio" transform="translate(-300 0)">
								<path id="studio-s" d="m8885 1410c-174-26-285-98-340-221-24-54-27-70-23-142 4-98 24-143 89-208 63-64 166-111 347-158 166-44 195-56 232-96 46-49 26-136-41-170-118-61-269-1-305 121l-15 54h-180c-204 0-190 8-164-93 34-132 121-245 223-290 182-82 522-72 677 19 169 99 244 313 171 488-54 130-186 203-498 275-148 35-188 57-188 106 0 61 50 95 138 95 76 0 132-34 162-97l25-53h173 172v28c0 43-35 136-69 185-56 82-141 130-270 153-81 14-234 16-316 4z"/>
								<path id="studio-t" d="m9690 1250v-150h195 195v-465-465l188 2 187 3 3 463 2 462h195 195v150 150h-580-580v-150z"/>
								<path id="studio-u" d="m11023 968c3-403 5-437 23-493 53-155 170-263 330-301 90-22 374-25 454-5 191 48 320 188 355 387 11 59 14 178 15 462v382h-190-190v-388c0-433-3-463-62-519-43-41-76-53-149-53-97 0-157 33-190 105-17 37-19 74-19 448v407h-191-190l4-432z"/>
								<path id="studio-d" d="m12450 785v-615h309c444 0 548 23 669 148 118 120 156 247 149 492-3 133-8 167-31 237-64 197-202 314-404 343-37 5-208 10-379 10h-313v-615zm591 319c68-20 120-72 140-140 19-65 19-324 1-377-8-21-25-51-39-68-43-51-77-62-200-67l-113-5v337 336h78c43 0 103-7 133-16z"/>
								<path id="studio-i" d="m13800 785v-615h190 190v615 615h-190-190v-615z"/>
								<path id="studio-o" d="m14885 1406c-306-60-475-281-475-621 0-267 109-469 304-565 202-99 509-92 695 17 117 68 215 212 246 361 19 93 19 286 0 377-43 203-181 352-389 417-82 25-285 33-381 14zm247-288c66-19 113-72 138-155 20-64 22-88 17-200-6-165-30-240-89-284-89-64-233-58-314 14-72 62-100 166-91 330 9 161 47 240 141 283 57 27 134 31 198 12z"/>
							</g>
						</g>
					</svg>
				</a>
				<nav id="main-menu" class="dropdown-menu horizontal-list"><ul><li class=""><a href="/">Dahlen Studio</a><ul><li class=""><a href="/about/">About</a></li><li><a href="/still/">Still</a><ul><li><a href="/still/advertising/">Advertising</a></li><li class=""><a href="/still/beauty/">Beauty</a></li><li class=""><a href="/still/fashion/">Fashion</a></li><li class=""><a href="/still/stars/">Stars</a></li></ul></li><li class=""><a href="/motion/">Motion</a><ul><li class=""><a href="/motion/introduction/">Introduction</a></li><li class=""><a href="/motion/ana-lisboa-steps/">Ana Lisboa Steps</a></li><li class=""><a href="/motion/heart-collage-jigsaw/">Heart Collage Jigsaw</a></li><li class=""><a href="/motion/charles-jourdan-film/">Charles Jourdan Film</a></li></ul></li><li class=""><a href="/new/">New</a></li><li class=""><a href="/contact/">Contact</a></li></ul></li></ul></nav>
				<h2 class="page-title breadcrumb visuallyhidden" data-opacity="0.75"><span class="parent">Still</span> ➤ <span class="current">Advertising</span></h2>
			</header>
			<main id="main-content">
	<section
	class="motion"
	data-name="charles-jourdan/bedroom-bed"
	data-timing="150"
	data-start="50"
	style="max-width:300px; max-height:225px;"
	data-width="300"
	data-height="225"
	data-music=""
	data-music-delay="0"
	data-fade-duration="0"
	>
	<button class="play-button icon-button absolute-center fade">
	<svg class="play-icon svg-icon" viewBox="0 0 100 100" title="Play Slideshow">
		<defs>
			<linearGradient id="spinner-one">
				<stop offset="0%" stop-color="rgba(255,255,255,0.8)"/>
				<stop offset="100%" stop-color="rgba(255,255,255,0.4)"/>
			</linearGradient>
			<linearGradient id="spinner-two">
				<stop offset="0%" stop-color="rgba(255,255,255,0.4)"/>
				<stop offset="100%" stop-color="rgba(255,255,255,0)"/>
			</linearGradient>
		</defs>
		<circle class="outer" cx="50" cy="50" r="47"/>
		<circle class="filler" cx="50" cy="50" r="47"/>
		<circle class="loading-inner" cx="50" cy="50" r="37"/>
		<path class="loading-spinner one" d="M 50,7 A 50,50,0,0,0,7,50" stroke="url(#spinner-one)"/>
		<path class="loading-spinner two" d="M 93,50 A 50,50,0,0,0,50,7" stroke="url(#spinner-two)"/>
		<path class="triangle" d="M 30,20 L 80,50 L 30,80 Z"/>
	</svg>
</button>
	<img src="/zenphoto/albums/charles-jourdan/bedroom-bed/poster.jpg" alt="Charles Jourdan Bedroom Bed" data-width="300" data-height="217">
</section>
<script src="/site/assets/slideshows/charles-jourdan/bedroom-bed.js"></script>

<section
	class="motion"
	data-name="pat-field-keith-haring/ana-lisboa-steps"
	data-timing="250"
	data-start="50"
	style="max-width:754px; max-height:503px;"
	data-width="754"
	data-height="503"
	data-music="1-tainted-love"
	data-music-delay="9000"
	data-fade-duration="2000"
	>
	<button class="play-button icon-button absolute-center fade">
	<svg class="play-icon svg-icon" viewBox="0 0 100 100" title="Play Slideshow">
		<defs>
			<linearGradient id="spinner-one">
				<stop offset="0%" stop-color="rgba(255,255,255,0.8)"/>
				<stop offset="100%" stop-color="rgba(255,255,255,0.4)"/>
			</linearGradient>
			<linearGradient id="spinner-two">
				<stop offset="0%" stop-color="rgba(255,255,255,0.4)"/>
				<stop offset="100%" stop-color="rgba(255,255,255,0)"/>
			</linearGradient>
		</defs>
		<circle class="outer" cx="50" cy="50" r="47"/>
		<circle class="filler" cx="50" cy="50" r="47"/>
		<circle class="loading-inner" cx="50" cy="50" r="37"/>
		<path class="loading-spinner one" d="M 50,7 A 50,50,0,0,0,7,50" stroke="url(#spinner-one)"/>
		<path class="loading-spinner two" d="M 93,50 A 50,50,0,0,0,50,7" stroke="url(#spinner-two)"/>
		<path class="triangle" d="M 30,20 L 80,50 L 30,80 Z"/>
	</svg>
</button>
	<img src="/zenphoto/albums/pat-field-keith-haring/ana-lisboa-steps/darker_join1.jpg" alt="Pat Field Keith Haring Ana Lisboa Steps" data-width="754" data-height="503">
</section>
<script src="/site/assets/slideshows/pat-field-keith-haring/ana-lisboa-steps/info.js"></script>

<section
	class="motion"
	data-name="general/introduction"
	data-timing="250"
	data-start="85"
	style="max-width:5100px; max-height:2850px;"
	data-width="5100"
	data-height="2850"
	data-music=""
	data-music-delay="0"
	data-fade-duration="1000"
	data-autoplay="true">
	<button class="play-button icon-button absolute-center fade">
	<svg class="play-icon svg-icon" viewBox="0 0 100 100" title="Play Slideshow">
		<defs>
			<linearGradient id="spinner-one">
				<stop offset="0%" stop-color="rgba(255,255,255,0.8)"/>
				<stop offset="100%" stop-color="rgba(255,255,255,0.4)"/>
			</linearGradient>
			<linearGradient id="spinner-two">
				<stop offset="0%" stop-color="rgba(255,255,255,0.4)"/>
				<stop offset="100%" stop-color="rgba(255,255,255,0)"/>
			</linearGradient>
		</defs>
		<circle class="outer" cx="50" cy="50" r="47"/>
		<circle class="filler" cx="50" cy="50" r="47"/>
		<circle class="loading-inner" cx="50" cy="50" r="37"/>
		<path class="loading-spinner one" d="M 50,7 A 50,50,0,0,0,7,50" stroke="url(#spinner-one)"/>
		<path class="loading-spinner two" d="M 93,50 A 50,50,0,0,0,50,7" stroke="url(#spinner-two)"/>
		<path class="triangle" d="M 30,20 L 80,50 L 30,80 Z"/>
	</svg>
</button>
	<img src="/zenphoto/albums/general/introduction/3feb15_collage3.jpg" alt="General Introduction" data-width="1216" data-height="1630">
</section>
<script src="/site/assets/slideshows/general/introduction.js"></script>

			</main>
			<button id="sound-button" class="clean-button img-button state--on"><img src="/site/assets/img/sound.png" alt="Toggle sound"></button>
		</div>
		<!--**************** BASE **************** -->
		<?php if (MINIFY): ?>
		<script src="/site/assets/dist/base.js"></script>
		<?php else: ?>
		<script src="/site/assets/vendor/js.cookie.min.js"></script>
		<script src="/site/assets/vendor/jquery.min.js"></script>
		<script src="/site/assets/vendor/lodash.min.js"></script>
		<script src="/site/assets/vendor/buzz.min.js"></script>

		<script src="/site/assets/src/js/components/timeouts/resettable-timeout.js"></script>

		<script src="/site/assets/src/js/components/events/event-emitter.js"></script>
		<script src="/site/assets/src/js/components/events/timeout-event-emitter.js"></script>

		<script src="/site/assets/src/js/components/dropdown/dropdown.js"></script>
		<script src="/site/assets/src/js/components/dropdown/autohide-dropdown.js"></script>
		<script src="/site/assets/src/js/components/dropdown/main-dropdown.js"></script>
		<script src="/site/assets/src/js/components/dropdown/dropdown-submenu.js"></script>

		<script src="/site/assets/src/js/components/music/music.js"></script>
		<script src="/site/assets/src/js/components/music/music-playlist.js"></script>
		<script src="/site/assets/src/js/components/music/music-muter.js"></script>
		
		<script src="/site/assets/src/js/app.js"></script>
		<?php endif; ?>
		<!--**************** BASE **************** -->

		<script>
			app.setConfig({"ALBUMS_URL":"\/zenphoto\/albums\/","DEBUG":true,"IS_LOCAL":false,"ASSETS_URL":"\/site\/assets\/","MINIFY":true,"IMG_SIZE_HASHES":{"320":"4056490732486c9be0e02a09ff0794b041e70149","980":"1d01a168b5f9adb3a2885a47082f71997bf3e905","1960":"54645fbc992e1a4297f6d277d236e536cb1c3b5f"},"IMG_QUALITY":85});
			app.setConfig({
				IS_LOCAL: location.hostname.indexOf('localhost') !== -1
			});
			app.setConfig({
				INTRO_SEQUENCE: app.config.IS_LOCAL ? ['logo','menu'] : ['bed','logo','menu','images']
			});
		</script>
	
		<!--**************** MOTION **************** -->
		<?php if (MINIFY): ?>
		<script src="/site/assets/dist/motion.js"></script>
		<?php else: ?>
		<script src="/site/assets/vendor/doubly-linked-list.min.js"></script>

		<script src="/site/assets/src/js/components/maths/rect.js"></script>

		<script src="/site/assets/src/js/components/loader/ajax-loader.js"></script>
		<script src="/site/assets/src/js/components/loader/image-loader.js"></script>

		<script src="/site/assets/src/js/components/motion/motion.js"></script>
		<script src="/site/assets/src/js/components/motion/motion-image.js"></script>
		<script src="/site/assets/src/js/components/motion/motion-animation.js"></script>
		<script src="/site/assets/src/js/components/motion/motion-queue.js"></script>
		<script src="/site/assets/src/js/components/motion/motion-loading-queue.js"></script>
		<script src="/site/assets/src/js/components/motion/motion-playing-queue.js"></script>
		
		<script src="/site/assets/src/js/templates/motion.js"></script>
		<?php endif; ?>
		<!--**************** MOTION **************** -->

		<!--**************** INTRO **************** -->
		<?php if (MINIFY): ?>
		<script src="/site/assets/dist/home.js"></script>
		<?php else: ?>
			
		<script src="/site/assets/src/js/components/intro/intro.js"></script>
		<script src="/site/assets/src/js/templates/home.js"></script>
		<?php endif; ?>
		<!--**************** INTRO **************** -->
	</body>
</html>
