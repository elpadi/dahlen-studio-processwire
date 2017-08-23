<?php
use Functional as F;
use Symfony\Component\Debug\Debug as SymfonyDebug;
use DahlenStudio\ContentPassword;

global $twig;
if ($config->debug) SymfonyDebug::enable();
$dotenv = new \Dotenv\Dotenv(__DIR__);
$dotenv->load();

ContentPassword::$allowedPages = explode(',', getenv('SKIP_PASSWORD_PAGES'));
ContentPassword::$passwords = array_map(function($plain) {
	return password_hash($plain, \PASSWORD_DEFAULT);
}, explode(',', getenv('CONTENT_PASSWORDS')));
$contentPassword = new ContentPassword($session);

if ($page->name === 'password' && $input->post('password')) {
	if ($contentPassword->match($input->post('password'))) {
		$contentPassword->onSuccess();
	}
	else {
		$template_vars['bad_password'] = TRUE;
	}
}

$vars = compact('page','user','config');
$vars['menu'] = $pages->get('/')->menuHtml();

$twig->addFilter(new Twig_SimpleFilter('zp_shortcode', ['\ProcessWire\Zenphoto','parseShortcodes']));
$twig->addFunction(new Twig_SimpleFunction('imageUrl', function($album, $filename, $size=980) use ($config) {
	return $config->debug ? "{$config->urls->root}zenphoto/albums/$album/$filename" : sprintf('%szenphoto/zp-core/i.php?a=%s&i=%s&s=%d&cw=0&ch=0&q=75&check=%s', $config->urls->root, $album, $filename, $size, $config->get("hash$size"));
}));
$twig->addFunction(new Twig_SimpleFunction('files', function($pattern, $ext='') {
	return array_map(function($s) use ($ext) { return basename($s, $ext); }, glob($pattern));
}));
$twig->addFunction(new Twig_SimpleFunction('json', 'json_encode'));
$twig->addGlobal('ASSETS_URL', $config->urls->assets);
$twig->addGlobal('ALBUMS_URL', $config->urls->root.'zenphoto/albums/');
array_map(function($type) use ($twig) {
	$key = strtoupper($type).'_VERSION';
	$version = getenv($key);
	$twig->addGlobal($key, $version ? $version : '1');
}, ['css','js','bower']);

if (isset($template_vars) && is_array($template_vars)) $vars = array_merge($vars, $template_vars);

if ($page->isHttpError()) {
	$code = $page->getHttpCode();
	$vars['page']->set('content', $twig->render("errors/$code.html"));
	$html = $twig->render("templates/basic-page.html", $vars);
}
elseif (!$contentPassword->canViewPage($user, $page)) {
	$vars['page']->set('content', $twig->render("snippets/password-wall.html", ['password_url' => $pages->get('name=password')->url]));
	$html = $twig->render("templates/basic-page.html", $vars);
}
else {
	$html = $twig->render(F\first(F\select(F\map([
		"pages/$page->name",
		"templates/{$page->template->name}",
		"templates/basic-page",
	], function($path) { return "$path.html"; }), function($s) { return is_readable(__DIR__."/templates/twig/$s"); })), $vars);
}
