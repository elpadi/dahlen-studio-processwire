<?php
$vars = compact('page','user','config');
$vars['menu'] = $pages->get('/')->menuHtml();

echo $GLOBALS['twig']->render($page->template->name.'.html', $vars);
