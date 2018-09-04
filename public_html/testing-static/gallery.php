<?php
define('MINIFY', false);
?><!doctype html>
<html class="no-js" lang="">
    <head>
		<meta charset="utf-8">
		<meta http-equiv="x-ua-compatible" content="ie=edge">
		<title>Dahlen Studio - Advertising</title>
		<meta name="description" content="Work done on behalf of several of the biggest and boldest brands in the fashion and beauty industries.">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" class="not-in-build" href="/site/assets/fonts/definitions.css?v=7">

		<?php if (MINIFY): ?>
		<link rel="stylesheet" href="/site/assets/dist/base.css">
		<?php else: ?>
		<link rel="stylesheet" href="/site/assets/vendor/normalize.min.css">
		<link rel="stylesheet" href="/site/assets/src/css/base/default.css">
		<link rel="stylesheet" href="/site/assets/src/css/base/classes.css">
		<link rel="stylesheet" href="/site/assets/src/css/base/colors.css">
		<link rel="stylesheet" href="/site/assets/src/css/components/loader.css">
		<link rel="stylesheet" href="/site/assets/src/css/components/menu.css">
		<link rel="stylesheet" href="/site/assets/src/css/main.css">
		<?php endif; ?>
		
		<?php if (MINIFY): ?>
		<link rel="stylesheet" href="/site/assets/dist/images.css">
		<?php else: ?>
		<!--
		<link rel="stylesheet" href="/site/assets/vendor/justifiedGallery.min.css">
		<link rel="stylesheet" href="/site/assets/vendor/featherlight.min.css">
		<link rel="stylesheet" href="/site/assets/vendor/featherlight.gallery.min.css">
		-->
		
		<link rel="stylesheet" href="/site/assets/src/css/components/slideshow.css">
		<link rel="stylesheet" href="/site/assets/src/css/templates/images.css?v=7">
		<?php endif; ?>
		
		<script>document.documentElement.className = 'js';</script>
    </head>
	<body class="page--advertising template--images parent--still theme--white">
		<div id="container">
			<?php include('header.php'); ?>
			<main id="main-content">
				<article id="advertising_new" class="fade slideshow grid-6" style="" data-name="advertising_new" data-music="">
					<?php //foreach (glob('img/originals/*.jpg') as $path) printf('<a href="/testing-static/%s">%s</a>', $path, basename($path)); ?>
				</article>
			</main>
			<svg class="spinning-circles-loader loader" width="58" height="58" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">
				<g fill="none" fill-rule="evenodd">
					<g transform="translate(2 1)" stroke="#FFF" stroke-width="1.5">
						<circle cx="42.601" cy="11.462" r="5"></circle>
						<circle cx="49.063" cy="27.063" r="5"></circle>
						<circle cx="42.601" cy="42.663" r="5"></circle>
						<circle cx="27" cy="49.125" r="5"></circle>
						<circle cx="11.399" cy="42.663" r="5"></circle>
						<circle cx="4.938" cy="27.063" r="5"></circle>
						<circle cx="11.399" cy="11.462" r="5"></circle>
						<circle cx="27" cy="5" r="5"></circle>
					</g>
				</g>
			</svg>
			<script>window["advertising_new"] = <?php $imgs = array_map(function($p) { return '/testing-static/img/originals/'.basename($p); }, glob('img/originals/*.jpg')); echo json_encode(array_merge($imgs, $imgs, $imgs, $imgs)); ?>;</script>
			<button id="sound-button" class="clean-button img-button state--on"><img src="/site/assets/img/sound.png" alt="Toggle sound"></button>
		</div>
		<script src="js/still-slideshow.js"></script>
		<script>window['static_test_images'] = <?= json_encode(glob('img/originals/*.jpg')); ?>;</script>
		<!--**************** BASE **************** -->
		<?php if (MINIFY): ?>
		<script src="/site/assets/dist/base.js"></script>
		<?php else: ?>
		<script src="/site/assets/vendor/jquery.min.js"></script>
		<script src="/site/assets/vendor/lodash.min.js"></script>
		<script src="/site/assets/src/js/components/events/queue/queue.js"></script>
		<script src="/site/assets/src/js/components/events/queue/init.js"></script>
		<script src="/site/assets/src/js/components/events/queue/load.js"></script>
		<script src="/site/assets/src/js/app.js"></script>

		<script src="/site/assets/vendor/js.cookie.min.js"></script>
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
		<?php endif; ?>
		<!--**************** BASE **************** -->
		
		<script>
			app.setConfig({"ALBUMS_URL":"\/zenphoto\/albums\/","DEBUG":true,"IS_LOCAL":true,"ASSETS_URL":"\/site\/assets\/","MINIFY":true,"IMG_SIZE_HASHES":{"320":"4056490732486c9be0e02a09ff0794b041e70149","980":"1d01a168b5f9adb3a2885a47082f71997bf3e905","1960":"54645fbc992e1a4297f6d277d236e536cb1c3b5f"},"IMG_QUALITY":85});
		</script>
	
		<?php if (MINIFY): ?>
		<script src="/site/assets/dist/slideshow.js"></script>
		<?php else: ?>
		<!--
		<script src="/site/assets/vendor/jquery.justifiedGallery.min.js"></script>
		<script src="/site/assets/vendor/featherlight.min.js"></script>
		<script src="/site/assets/vendor/featherlight.gallery.min.js"></script>

		<script src="/site/assets/src/js/components/loader/image-loader.js"></script>
		<script src="/site/assets/src/js/components/loader/ajax-loader.js"></script>

		<script src="/site/assets/src/js/components/pager/pager.js"></script>
		<script src="/site/assets/src/js/components/pager/infinite-scroll-pager.js"></script>

		<script src="/site/assets/src/js/components/gallery/gallery-pager.js"></script>
		<script src="/site/assets/src/js/components/gallery/image-listing-loader.js"></script>

		<script>window.addEventListener('load', e => document.getElementById('main-content').classList.remove('loading'));</script>
		-->
		<script src="/site/assets/src/js/components/gallery/thumb-grid.js"></script>
		<script src="/site/assets/src/js/components/gallery/gallery.js"></script>
		<script src="/site/assets/src/js/templates/slideshow.js"></script>
		<?php endif; ?>
	</body>
</html>
