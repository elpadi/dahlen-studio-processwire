<?php
header('Content-type: application/json');
$images = array_map(function($path) {
	return [
		'url' => sprintf('/sample-gallery/%s', $path),
		'thumb' => [
			'url' => sprintf('/sample-gallery/%s', str_replace('originals', 'thumbs', $path)),
		],
	];
}, glob('img/originals/*.jpg'));
shuffle($images);
echo json_encode($images);
