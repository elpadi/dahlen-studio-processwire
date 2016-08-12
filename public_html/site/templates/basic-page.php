<?php
use Functional as F;
global $twig;

$vars = compact('page','user','config');
$vars['menu'] = $pages->get('/')->menuHtml();

$twig->addFunction(new Twig_SimpleFunction('imageUrl', function($album, $filename, $size=980) {
	return sprintf('%szenphoto/zp-core/i.php?a=%s&i=%s&s=%d&cw=0&ch=0&q=75', $GLOBALS['wire']->config->urls->root, $album, $filename, $size);
}));
$twig->addFunction(new Twig_SimpleFunction('files', function($pattern) {
	return array_map('basename', glob($pattern));
}));
$twig->addFunction(new Twig_SimpleFunction('json', 'json_encode'));
$twig->addGlobal('ASSETS_URL', $config->urls->assets);
$twig->addGlobal('ALBUMS_URL', $config->urls->root.'zenphoto/albums/');

echo $twig->render(F\first(F\select(F\map([
	"pages/$page->name",
	"templates/{$page->template->name}",
	"templates/basic-page",
], function($path) { return "$path.html"; }), function($s) { return is_readable(__DIR__."/twig/$s"); })), $vars);
