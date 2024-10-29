<?php

if (count($argv) < 2) {
	echo "Usage: php add-use-strict.php <path>\n";
	exit;
}

$path = $argv[1];
echo "Adding use strict to " . $path . "\n";

function addUseStrictToFile($path) {
	$contents = file_get_contents($path);
	file_put_contents($path, '"use strict";' . "\n\n" . $contents);
}

function addUseStrictToDirectory($dirname) {
	$files = scandir($dirname);
	foreach ($files as $key => $value) {
		if ($value != "." && $value != "..") {
			$path = realpath($dirname . DIRECTORY_SEPARATOR . $value);
			addUseStrict($path);
		}
	}
}

function addUseStrict($path) {
	if (!is_dir($path)) {
		$extension = pathinfo($path, PATHINFO_EXTENSION);
		if ($extension === "js") {
			addUseStrictToFile($path);
		}
	} else {
		addUseStrictToDirectory($path);
	}
}

addUseStrict($path);

?>