<?php
$loader = new Twig_Loader_Filesystem($config->paths->templates.'/twig');
$twig = new Twig_Environment($loader, array(
    'cache' => $config->debug ? FALSE : $config->paths->cache.'/twig',
));

$vars = compact('page','user','config');
$vars['menu'] = $pages->get('/')->menuHtml();

echo $twig->render($page->template->name.'.html', $vars);
