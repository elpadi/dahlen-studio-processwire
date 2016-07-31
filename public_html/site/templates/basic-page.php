<?php
$vars = compact('page','user','config');
$vars['menu'] = $pages->get('/')->menuHtml();

$GLOBALS['twig']->addFunction(new Twig_SimpleFunction('files', function($pattern) {
	return array_map('basename', glob($pattern));
}));
$GLOBALS['twig']->addFunction(new Twig_SimpleFunction('json', 'json_encode'));

echo $GLOBALS['twig']->render(is_readable(__DIR__."/twig/$page->name.html") ? "$page->name.html" : "{$page->template->name}.html", $vars);
