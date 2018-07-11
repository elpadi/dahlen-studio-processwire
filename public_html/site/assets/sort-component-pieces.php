<?php
$inheritance_map = [];
$class_map = [];
while ($path = trim(fgets(STDIN))) {
	$fp = fopen($path, 'r');
	if (!$fp) {
		var_dump($path);
		exit();
	}
	$first = fgets($fp);
	preg_match('/class ([[:alpha:]]+)/', $first, $matches);
	$class_map[$matches[1]] = $path;
	if (strpos($first, 'extends') !== FALSE) {
		preg_match('/class ([[:alpha:]]+) extends ([[:alpha:]]+)/', $first, $matches);
		$inheritance_map[$matches[1]] = $matches[2];
	}
}
uksort($class_map, function($classA, $classB) use ($inheritance_map) {
	if (isset($inheritance_map[$classA]) && $inheritance_map[$classA] == $classB) return 1;
	if (isset($inheritance_map[$classB]) && $inheritance_map[$classB] == $classA) return -1;
	return strlen($classA) - strlen($classB);
});
foreach ($class_map as $path) fwrite(STDOUT, "$path\n");
