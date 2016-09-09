<?php
use Functional as F;
global $twig;

if ($page->name === 'password' || (!empty($config->contentPassword) && $user->isGuest() && !$session->get('entered_password'))) {
	if ($page->name === 'password' && $input->post('password')) {
		if (password_verify($input->post('password'), $config->contentPassword)) {
			$session->set('entered_password', TRUE);
			header('Location: http://'.$_SERVER['HTTP_HOST'].($session->get('password_referrer') && !strstr($session->get('password_referrer'), 'password') ? $session->get('password_referrer') : '/'));
			exit(302);
		}
		else {
			$template_vars['bad_password'] = TRUE;
		}
	}
	elseif ($page->name !== 'password') {
		if (strstr($_SERVER['HTTP_HOST'], 'dahlenstudio.com')) $session->set('password_referrer', $_SERVER['REQUEST_URI']);
		$session->redirect('/password', false);
	}
}

$vars = compact('page','user','config');
$vars['menu'] = $pages->get('/')->menuHtml();

$twig->addFilter(new Twig_SimpleFilter('zp_shortcode', ['\ProcessWire\Zenphoto','parseShortcodes']));
$twig->addFunction(new Twig_SimpleFunction('imageUrl', function($album, $filename, $size=980) use ($config) {
	return sprintf('%szenphoto/zp-core/i.php?a=%s&i=%s&s=%d&cw=0&ch=0&q=75&check=%s', $config->urls->root, $album, $filename, $size, $config->get("hash$size"));
}));
$twig->addFunction(new Twig_SimpleFunction('files', function($pattern, $ext='') {
	return array_map(function($s) use ($ext) { return basename($s, $ext); }, glob($pattern));
}));
$twig->addFunction(new Twig_SimpleFunction('json', 'json_encode'));
$twig->addGlobal('ASSETS_URL', $config->urls->assets);
$twig->addGlobal('ALBUMS_URL', $config->urls->root.'zenphoto/albums/');

if (isset($template_vars) && is_array($template_vars)) $vars = array_merge($vars, $template_vars);

if ($user->isGuest() && $page->id !== 1 && $page->name !== 'password') {
	$vars['page']->set('content', '<p class="tc">Coming soon.</p>');
	$html = $twig->render("templates/basic-page.html", $vars);
}
else {
	$html = $twig->render(F\first(F\select(F\map([
		"pages/$page->name",
		"templates/{$page->template->name}",
		"templates/basic-page",
	], function($path) { return "$path.html"; }), function($s) { return is_readable(__DIR__."/templates/twig/$s"); })), $vars);
}
