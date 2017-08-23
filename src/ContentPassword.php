<?php
namespace DahlenStudio;

class ContentPassword {

	public static $allowedPages = [];
	public static $passwords = [];

	protected $session;

	public function __construct($session) {
		$this->session = $session;
	}

	public function isEnabled() {
		return !empty(static::$passwords);
	}

	public function canViewPage($user, $page) {
		return !$this->isEnabled()
			|| $page->id == 1
			|| (string)$page->template === 'images'
			|| in_array($page->name, static::$allowedPages)
			|| $this->isUserAuthorized($user);
	}

	public function isUserAuthorized($user) {
		return !$user->isGuest() || $this->session->get('entered_password') === TRUE;
	}

	public function match($password) {
		if (!$this->isEnabled()) return TRUE;
		return F\some(static::$passwords, function($p) use ($password) {
			return password_verify($password, $p);
		});
	}

	public function onSuccess() {
		$this->session->set('entered_password', TRUE);
		$referrer = $this->session->get('password_referrer');
		$url = $referrer && !strstr($referrer, 'password') ? $referrer : '/';
		header('Location: http://'.$_SERVER['HTTP_HOST'].$url);
		exit(302);
	}

}

