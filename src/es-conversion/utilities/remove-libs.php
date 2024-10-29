<?php

if (count($argv) < 2) {
	echo "Usage: php remove-libs.php <path>\n";
	exit;
}

$path = $argv[1];
echo "Removing libs from " . $path . "\n";

function removeLibsFromFile($path) {
	$contents = file_get_contents($path);
	$lines = explode("\n", $contents);
	$lines2 = [];

	$i = 0;
	while ($i < count($lines)) {
		$line = $lines[$i++];

		if (str_starts_with($line, 'import $') || str_starts_with($line, 'import _')) {

			// skip line
			//
		} else {

			// add code line
			//
			array_push($lines2, $line);
		}
	}

	$contents = implode("\n", $lines2);
	file_put_contents($path, $contents);
}

function removeLibsFromDirectory($dirname) {
	$files = scandir($dirname);
	foreach ($files as $key => $value) {
		if ($value != "." && $value != "..") {
			$path = realpath($dirname . DIRECTORY_SEPARATOR . $value);
			removeLibs($path);
		}
	}
}

function removeLibs($path) {
	if (!is_dir($path)) {
		$extension = pathinfo($path, PATHINFO_EXTENSION);
		if ($extension === "js") {
			removeLibsFromFile($path);
		}
	} else {
		removeLibsFromDirectory($path);
	}
}

removeLibs($path);

?>