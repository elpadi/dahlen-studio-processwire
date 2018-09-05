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
		<link rel="stylesheet" href="/site/assets/dist/base.min.css">
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
		<link rel="stylesheet" href="/site/assets/dist/slideshow.min.css">
		<?php else: ?>
		<link rel="stylesheet" href="/site/assets/src/css/templates/images.css?v=7">
		<link rel="stylesheet" href="/site/assets/src/css/components/slideshow.css">
		<?php endif; ?>
		
		<script>document.documentElement.className = 'js';</script>
    </head>
	<body class="page--advertising template--images parent--still theme--white">
		<div id="container">
			<?php include('header.php'); ?>
			<main id="main-content">
				<article id="advertising_new" class="fade slideshow grid-6" style="" data-name="advertising_new" data-music=""></article>
				<script src="js/still-slideshow.js"></script>
			</main>
			<button id="sound-button" class="clean-button img-button state--on"><img src="/site/assets/img/sound.png" alt="Toggle sound"></button>
		</div>
		<!--**************** BASE **************** -->
		<?php if (MINIFY): ?>
		<script src="/site/assets/dist/base.min.js"></script>
		<?php else: ?>
		<script src="/site/assets/vendor/jquery.min.js"></script>
		<script src="/site/assets/vendor/lodash.min.js"></script>
		<script src="/site/assets/src/js/components/event-queue/event-queue.js"></script>
		<script src="/site/assets/src/js/components/event-queue/init-event-queue.js"></script>
		<script src="/site/assets/src/js/components/event-queue/load-event-queue.js"></script>
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
		<script src="/site/assets/dist/slideshow.min.js"></script>
		<?php else: ?>
		<script src="/site/assets/src/js/components/gallery/gallery-image.js"></script>
		<script src="/site/assets/src/js/components/gallery/thumb-grid-column.js"></script>
		<script src="/site/assets/src/js/components/gallery/thumb-grid.js"></script>
		<script src="/site/assets/src/js/components/gallery/gallery.js"></script>

		<script src="/site/assets/src/js/components/loader/image-loader.js"></script>

		<script src="/site/assets/src/js/templates/slideshow.js"></script>
		<?php endif; ?>
	</body>
</html>
