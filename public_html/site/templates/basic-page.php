<?php
$vars = compact('page','user','config');
$vars['menu'] = $pages->get('/')->menuHtml();

$GLOBALS['twig']->addFunction(new Twig_SimpleFunction('files', function($pattern) {
	return array_map('basename', glob($pattern));
}));
$GLOBALS['twig']->addFunction(new Twig_SimpleFunction('json', 'json_encode'));
$GLOBALS['twig']->addGlobal('ASSETS_URL', $config->urls->assets);
$GLOBALS['twig']->addGlobal('ALBUMS_URL', $config->urls->root.'zenphoto/albums/');

echo $GLOBALS['twig']->render(is_readable(__DIR__."/twig/pages/$page->name.html") ? "pages/$page->name.html" : "{$page->template->name}.html", $vars);
